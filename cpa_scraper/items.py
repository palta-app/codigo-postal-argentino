# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class CustomItem(scrapy.Item):
    # Ignore on serialize items
    _ignore_fields = ["_inner_category"]

    def serialize(self):
        serialized_data = {}
        for field_name, field_value in self.items():
            if field_name not in self._ignore_fields:
                serialized_data[field_name] = field_value
        return serialized_data


class LocalityItem(CustomItem):
    # Required fields
    locality_id = scrapy.Field()
    name = scrapy.Field()
    zip_code = scrapy.Field()
    state = scrapy.Field()

    # Internal category used in pipelines to separate categories and files
    # maybe validations or remove duplicates
    _inner_category = scrapy.Field(serialize=False)
