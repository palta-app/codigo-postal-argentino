# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class LocalitiesItem(scrapy.Item):
    localities = scrapy.Field()
    CPA = scrapy.Field()
    CPA_links = scrapy.Field()
    city = scrapy.Field()
    state = scrapy.Field()
    
    st_local = scrapy.Field()
    st_city = scrapy.Field()
    st_state = scrapy.Field()
    street = scrapy.Field()
    street_cpa = scrapy.Field()
    street_link = scrapy.Field()
    street_number = scrapy.Field()