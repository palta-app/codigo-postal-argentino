# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class LocalityItem(scrapy.Item):
    id_ = scrapy.Field()
    name = scrapy.Field()
    zip_ = scrapy.Field()
    state = scrapy.Field()
