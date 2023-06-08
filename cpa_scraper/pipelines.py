# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy.exceptions import DropItem
from itemadapter import ItemAdapter


class DuplicatesPipeline:
    _locality_items = set()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        if adapter["_inner_category"] == "localities":
            compose_locality = f'{adapter["name"]}_{adapter["zip_code"]}'
            if compose_locality in self._locality_items:
                raise DropItem(f"Duplicated name found: {item!r}")
            else:
                self._locality_items.add(compose_locality)
                return item.serialize()
