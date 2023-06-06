import re
from scrapy.spiders import Spider
from cpa_scraper.items import LocalityItem
from cpa_scraper.loaders import LocalityLoader

CPA_REGEX = r"[A-Z]\d{4}[A-Z]{3}"


class LocationsSpider(Spider):
    name = "localities"
    allowed_domains = ["codigo-postal.co"]
    start_urls = ["https://codigo-postal.co/argentina/"]

    def parse(self, response):
        provinces = response.css(".column-list a::attr(href)")
        yield from response.follow_all(provinces, callback=self.parse_cities)

    def parse_cities(self, response):
        cities = response.css(".cities a::attr(href)")
        yield from response.follow_all(cities, callback=self.parse_localities)

    def parse_localities(self, response):
        rows = response.xpath("//table/tbody/tr")
        for row in rows:
            cpa = row.css("td a::text").get(default="")
            if cpa and re.search(CPA_REGEX, cpa):
                locality = LocalityLoader(item=LocalityItem(), selector=row)
                locality.add_xpath("name", ".//td[2]/text()")
                locality.add_css("zip_", "td a::text")
                locality.add_css("state", "td:nth-child(1)::text")
                yield locality.load_item()
