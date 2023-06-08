import scrapy
from postal_code.items import MyItem
import json
from unidecode import unidecode

class CountriesSpider(scrapy.Spider):
    name = "countries"
    
    start_urls = [
        'https://codigo-postal.co/'
    ]

    custom_settings = {
        # this parameter determine the number of requests at the same time
        # because scrapy is a framework asynchronous
        'CONCURRENT_REQUESTS': 8,

        # restart the process once we ride the spider again
        'DUPEFILTER_CLASS': 'scrapy.dupefilters.BaseDupeFilter',

        # encoding
        'FEED_EXPORT_ENCODING': 'utf-8'
    }

    laux_states = 0
    naux_states = 0

    def __init__(self, country):
        self.country = unidecode(country).lower()

    def xpath(self, flag=True):
        with open('./xpath.json') as f:
            xpath = json.load(f)[0]
        if flag:
            xpath = xpath[self.country.upper()]
        return xpath
    
    def parse_cities(self, response, **kwargs):
        if kwargs:
            item = kwargs['item']
            state = kwargs['state']

        cities_links = response.xpath(self.xpath()['CITIES_LINKS']).getall()
        cities_names = response.xpath(self.xpath()['CITIES_NAMES']).getall()

        item['city_state'].extend([state] * len(cities_names))
        item['cities_names'].extend(cities_names)
        item['cities_links'].extend(cities_links)
            
        yield item

        if not (cities_links and cities_names):
            yield response.follow(response.url, callback=self.parse_cities, cb_kwargs={'item': item, 'state': state})
        
        elif cities_links and cities_names:
            yield response.follow(next(self.laux_states), callback=self.parse_cities,
                                  cb_kwargs={'item': item, 'state': next(self.naux_states)})

    def parse_state(self, response, **kwargs):
        if kwargs:
            item = kwargs['item']

        states_links = response.xpath(self.xpath()['STATES_LINKS']).getall()
        states_names = response.xpath(self.xpath()['STATES_NAMES']).getall()

        self.laux_states = iter(states_links)
        self.naux_states = iter(states_names)

        item['states_names'] = states_names
        item['states_links'] = states_links

        item['cities_names'] = []
        item['cities_links'] = []
        item['city_state'] = []

        yield response.follow(next(self.laux_states), callback=self.parse_cities,
                              cb_kwargs={'item': item, 'state': next(self.naux_states)})

    def parse(self, response):

        country_links = response.xpath(self.xpath(flag=False)['COUNTRY_LINKS']).getall()
        country_names = response.xpath(self.xpath(flag=False)['COUNTRY_NAMES']).getall()

        country_names = [unidecode(x[14:]).lower() for x in country_names]

        item = MyItem()
        item['countries_names'] = country_names

        country_id = country_names.index(self.country)
        url = country_links[country_id]

        yield response.follow(url, callback=self.parse_state, cb_kwargs={'item': item})