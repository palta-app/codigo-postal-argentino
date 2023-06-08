import re
from scrapy.spiders import Spider
from cpa_scraper.items import LocalityItem
from cpa_scraper.loaders import LocalityLoader
from nanoid import generate

CPA_REGEX = r"[A-Z]\d{4}[A-Z]{3}"


class LocationsSpider(Spider):
    name = "localities"
    allowed_domains = ["codigo-postal.co"]
    start_urls = ["https://codigo-postal.co/argentina/"]

    def parse(self, response):
        provinces = response.css(".column-list a::attr(href)")[2:3]
        yield from response.follow_all(provinces, callback=self.parse_cities)

    def parse_cities(self, response):
        cities = response.css(".cities a::attr(href)")
        yield from response.follow_all(cities, callback=self.parse_localities)

    def parse_localities(self, response):
        rows = response.xpath("//table/tbody/tr")
        for row in rows:
            cpa = row.css("td a::text").get(default="")
            if cpa and re.search(CPA_REGEX, cpa):
                locality_id = generate(size=10)
                yield from self.parse_locality_item(row, locality_id)

    def parse_locality_item(self, row, locality_id):
        locality = LocalityLoader(item=LocalityItem(), selector=row)
        locality.add_value("locality_id", locality_id)
        locality.add_value("_inner_category", "locality")
        locality.add_xpath("name", ".//td[2]/text()")
        locality.add_css("zip_code", "td a::text")
        locality.add_css("state", "td:nth-child(1)::text")
        yield locality.load_item()
