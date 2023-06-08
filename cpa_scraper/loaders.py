from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst


def strip_str(value):
    return value.strip() if value else ""


class LocalityLoader(ItemLoader):
    default_output_processor = TakeFirst()
    name_in = MapCompose(strip_str)
    zip_code_in = MapCompose(strip_str)
    state = MapCompose(strip_str)
