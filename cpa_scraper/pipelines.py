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
        category = adapter.get("_inner_category")

        if category == "localities":
            compose_locality = f'{adapter["name"]}_{adapter["zip_code"]}'
            if compose_locality in self._locality_items:
                raise DropItem(f"Duplicated name found: {item!r}")
            else:
                self._locality_items.add(compose_locality)

        if category == "streets":
            if not adapter.get("name"):
                raise DropItem(f"Remove empty street name {item!r}")

        if category == "numbers":
            if not adapter.get("zip_code"):
                raise DropItem(f"Remove empty street zip_code {item!r}")

        return item


class CSVPipeline:
    def __init__(self):
        self._category = None
        self._now = None
        self._headers = {}

    def open_spider(self, spider):
        self._now = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        self._category = adapter.get("_inner_category")

        self.write_to_csv(item)

        return item

    def write_to_csv(self, item):
        fname = f"{self._category}_{self._now}.csv"
        fullpath = path.join(f"local_data/{self._category}", fname)

        with open(fullpath, "a", newline="", encoding="UTF-8") as f:
            new_item = item.serialize()
            dict_writer = csv.DictWriter(f, new_item.keys())
            if self._category not in self._headers:
                self._headers[self._category] = True
                dict_writer.writeheader()
            dict_writer.writerow(new_item)
