# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy.exceptions import DropItem
from itemadapter import ItemAdapter
from nanoid import generate


class DuplicatesPipeline:
    cpas = set()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        if adapter["name"] in self.cpas:
            raise DropItem(f"Duplicated name found: {item!r}")
        else:
            self.cpas.add(adapter["name"])
            return item


class DefaultIDPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        adapter["id_"] = generate(size=10)

        return item
