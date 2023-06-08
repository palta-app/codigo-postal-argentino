# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy.exceptions import DropItem
from itemadapter import ItemAdapter
from datetime import datetime
from os import path
import csv


class DuplicatesPipeline:
    def __init__(self):
        self._locality_items = set()  # for remove duplicates

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        if adapter["_inner_category"] == "localities":
            compose_locality = f'{adapter["name"]}_{adapter["zip_code"]}'
            if compose_locality in self._locality_items:
                raise DropItem(f"Duplicated name found: {item!r}")
            else:
                self._locality_items.add(compose_locality)

        return item


class CSVPipeline:
    def __init__(self):
        self._category = None
        self._localities = []

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        self._category = adapter["_inner_category"]

        if self._category == "localities":
            self._localities.append(item.serialize())

        return item

    def close_spider(self, spider):
        now = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
        fname = f"{self._category}_{now}.csv"
        fullpath = path.join(f"local_data/{self._category}", fname)

        with open(fullpath, "w", newline="") as f:
            keys = self._localities[0].keys()
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(self._localities)
