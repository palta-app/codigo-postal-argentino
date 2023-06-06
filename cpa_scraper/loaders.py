from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst


def strip_name(value):
    return value.strip() if value else ""


class LocalityLoader(ItemLoader):
    default_output_processor = TakeFirst()
    name_in = MapCompose(strip_name)
