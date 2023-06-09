# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

'''This is the pre structure for stored data in the database. 
    Items communicate the spider with the pipeline'''

import scrapy

class MyItem(scrapy.Item):
    countries_names = scrapy.Field()
    
    states_names = scrapy.Field()
    states_links = scrapy.Field()

    cities_names = scrapy.Field()
    cities_links = scrapy.Field()
    city_state = scrapy.Field()