import scrapy
import sqlite3
import json
from unidecode import unidecode
from localities.items import LocalitiesItem

'''This is the second spider since it cannot work if the <postal_code> scraper is not run first.
The structure is similir, it has 3 functions and a Item (LocalitiesItem) that store data to send it
to <pipelines.py>'''

class LocalitiesSpider(scrapy.Spider):
    name = 'localities'

    start_urls = 0
    cities_names, states_names = 0, 0

    custom_settings = {
        # this parameter determine the number of requests at the same time
        # because scrapy is a framework asynchronous
        'CONCURRENT_REQUESTS': 24,

        # restart the process once we ride the spider again
        'DUPEFILTER_CLASS': 'scrapy.dupefilters.BaseDupeFilter',

        # encoding
        'FEED_EXPORT_ENCODING': 'utf-8'
    }

    '''Initialize the country to work with, and the start_urls. The spider brings in the 
        urls related to each city extracted for the scraper <postal_code>'''

    def __init__(self, country):
        self.country = unidecode(country).lower()

        path = './../postal_code.sqlite'
        connection = sqlite3.connect(path)
        cursor = connection.cursor()

        '''Here you can choose by hardcoding the state to scrape in. However you can use the first
            <query> variable to scrape the whole website for the country selected'''

        # query = '''SELECT name, link, state FROM City
        #             ORDER BY state ASC'''

        query = '''SELECT name, link, state FROM City 
                    WHERE state = "{}"
                    ORDER BY state ASC'''.format("Buenos Aires")

        cursor.execute(query)
        rows = cursor.fetchall()
        
        self.cities_names = [r[0] for r in rows]#[:20]
        self.start_urls = [r[1] for r in rows]#[:20]
        self.states_names = [r[2] for r in rows]#[:20]
        
        cursor.close()
        connection.close()

    '''Call the json file that contains the XPath expressions for the scraper'''
    def xpath(self):
        with open('./xpath.json') as f:
            xpath = json.load(f)[0][self.country.upper()]
        return xpath
    
    '''Because the street on its self has no a unique CPA, the spider extracts the CPA por each number and
        parity of the street. Moreover, there some street that has not any CPA, so the spider ignores them
        and stores it as 'No Need' or 'Not Found' in function of the case'''
    def parse_street(self, response, **kwargs):
        if kwargs:
            city = kwargs['city']
            state = kwargs['state']
            locality = kwargs['locality']
            street = kwargs['street']

        item = LocalitiesItem()
        item['CPA'], item['CPA_links'], item['localities'], item['city'], item['state'] = [], [], [], [], []

        item['st_local'] = []
        item['st_city'] = []
        item['st_state'] = []
        item['street'] = []
        item['street_cpa'] = []
        item['street_link'] = []
        item['street_number'] = []

        street_cpa_link = response.xpath(self.xpath()["STREET_CPA"][0]).getall()
        street_cpa = response.xpath(self.xpath()["STREET_CPA"][1]).getall()

        street_first_n = response.xpath(self.xpath()["STREET_TABLE"].format(2)).getall()
        street_last_n = response.xpath(self.xpath()["STREET_TABLE"].format(3)).getall()
        street_parity = response.xpath(self.xpath()["STREET_TABLE"].format(4)).getall()

        street_number = [str(f)+'-'+str(l)+' '+str(x[8:]) for f, l, x in zip(street_first_n, street_last_n, street_parity)]

        table = response.xpath(self.xpath()["POSTAL_CODES2"][1]).getall()
        postal_code = response.xpath(self.xpath()["POSTAL_CODES2"][0]).get()

        no_cpa = response.xpath(self.xpath()["MISSING"]).get()
        if not no_cpa:
            no_cpa = ''

        if street_cpa_link and street_number:
            for ii, cpa in enumerate(street_cpa):
                item['st_local'].append(locality)
                item['st_city'].append(city)
                item['st_state'].append(state)
                item['street'].append(street)
                item['street_cpa'].append(cpa)
                item['street_link'].append(street_cpa_link[ii])
                item['street_number'].append(street_number[ii])
            
        elif postal_code and not table:
            item['st_local'].append(locality)
            item['st_city'].append(city)
            item['st_state'].append(state)
            item['street'].append(street)
            item['street_cpa'].append(postal_code)
            item['street_link'].append(response.url)
            item['street_number'].append('No Need')
            
        elif ('No hemos podido encontrar' in no_cpa) or (response.url[:-1] in set(self.start_urls)):
            item['st_local'].append(locality)
            item['st_city'].append(city)
            item['st_state'].append(state)
            item['street'].append(street)
            item['street_cpa'].append('Not Found')
            item['street_link'].append(response.url)
            item['street_number'].append('Not Found')

        elif not (street_cpa_link and street_number):
            print("parse_street")
            print(state, city, locality, street, response)
            yield response.follow(response.url, callback=self.parse_street,
                                cb_kwargs={'city':city, 'state': state, 
                                            'locality': locality, 'street': street})
        
            
        yield item

    '''Because some localities has no a unique CPA, spider extract the streets for the locality and
        send this link to <parse_street>'''
    def parse_search_street(self, response, **kwargs):
        if kwargs:
            city = kwargs['city']
            state = kwargs['state']
            locality = kwargs['locality']

        street_names = response.xpath(self.xpath()["STREET_NAMES"]).getall()
        street_links = response.xpath(self.xpath()["STREET_LINKS"]).getall()

        no_cpa = response.xpath(self.xpath()["MISSING"]).get()
        if not no_cpa:
            no_cpa = ''

        item = LocalitiesItem()
        item['CPA'], item['CPA_links'], item['localities'], item['city'], item['state'] = [], [], [], [], []
        item['st_local'], item['st_city'], item['st_state'], item['street'], item['street_cpa'], item['street_link'], item['street_number'] = [], [], [], [], [], [], []
            
        if 'No hemos podido encontrar' in no_cpa:
            item['CPA'].append('Not Found')
            item['CPA_links'].append(response.url)
            item['localities'].append(locality)
            item['city'].append(city)
            item['state'].append(state)

        elif street_links and street_names:
            for name, url in zip(street_names, street_links):
                yield response.follow(url, callback=self.parse_street,
                                      cb_kwargs={'city':city, 'state': state, 
                                                 'locality': locality, 
                                                 'street': name})
                
        elif not(street_links and street_names):
            print('\n')
            print("parse_search_street")
            print(state, city, locality, no_cpa)
            yield response.follow(response.url, callback=self.parse_search_street,
                                  cb_kwargs={'city':city, 'state': state, 'locality': locality})
                
        yield item

    '''Framework's main function. For each link in start_urls the spider extracts all the localities for
        city, its CPA and so forth. However some localities has no a unique CPA, instead each street in
        the locality is depicted by its own CPA. So in that case the spider goes to <parse_search_street>'''        
    def parse(self, response):
        
        localities = response.xpath(self.xpath()['TABLE_COLUMN'].format(2)).getall()
        postal_codes = response.xpath(self.xpath()['POSTAL_CODES']).getall()
        postal_codes_links = response.xpath(self.xpath()['POSTAL_CODES_LINKS']).getall()

        postal_codes2 = response.xpath(self.xpath()['POSTAL_CODES2'][0]).get()
        table = response.xpath(self.xpath()['POSTAL_CODES2'][1]).getall()

        indeces = self.start_urls.index(response.url)
        city = self.cities_names[indeces]
        state = self.states_names[indeces]

        item = LocalitiesItem()
        item['CPA'] = []
        item['CPA_links'] = []
        item['localities'] = []
        item['city'] = []
        item['state'] = []

        item['st_local'], item['st_city'], item['st_state'], item['street'], item['street_cpa'], item['street_link'], item['street_number'] = [], [], [], [], [], [], []

        if postal_codes2 and not table:
            item['CPA'].append(postal_codes2)
            item['CPA_links'].append(response.url)
            item['localities'].append(city)
            item['city'].append(city)
            item['state'].append(state)

        elif localities and not(postal_codes and postal_codes_links):
            localities = response.xpath(self.xpath()['TABLE_COLUMN'].format(1)).getall()
            postal_codes = response.xpath(self.xpath()['TABLE_COLUMN'].format(4)).getall()
            postal_codes_links = [response.url] * len(localities)

        elif not(localities and postal_codes and postal_codes_links):
            yield response.follow(response.url, callback=self.parse)

        for ii, pcl in enumerate(postal_codes):
            if not ("Buscar" in pcl):
                item['CPA'].append(pcl)
                item['CPA_links'].append(postal_codes_links[ii])
                item['localities'].append(localities[ii])
                item['city'].append(city)
                item['state'].append(state)
            else:
                yield response.follow(postal_codes_links[ii], callback=self.parse_search_street,
                                      cb_kwargs={'city':city, 'state': state, 'locality': localities[ii]})

        yield item
