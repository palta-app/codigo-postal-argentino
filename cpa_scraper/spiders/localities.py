import re
from scrapy.spiders import Spider
from cpa_scraper.items import LocalityItem, StreetItem, NumberItem
from cpa_scraper.loaders import LocalityLoader, StreetLoader, NumberLoader
from nanoid import generate

CPA_REGEX = r"[A-Z]\d{4}[A-Z]{3}"


class LocalitiesSpider(Spider):
    name = "localities"
    allowed_domains = ["codigo-postal.co"]
    start_urls = ["https://codigo-postal.co/argentina/"]

    def parse(self, response):
        # for testing purposes
        # provinces = response.css(".column-list a::attr(href)")[2:3]
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
                yield from self.parse_locality_item(row)
            else:
                search_page = row.css("td a::attr(href)").get()
                yield response.follow(
                    search_page,
                    callback=self.parse_streets,
                )

    def parse_locality_item(self, row):
        locality_id = generate(size=10)
        locality = LocalityLoader(item=LocalityItem(), selector=row)
        locality.add_value("locality_id", locality_id)
        locality.add_value("_inner_category", "localities")
        locality.add_xpath("name", ".//td[2]/text()")
        locality.add_css("zip_code", "td a::text")
        locality.add_css("state", "td:nth-child(1)::text")
        yield locality.load_item()

    def parse_streets(self, response):
        streets = response.css(".three_columns a::attr(href)")
        yield from response.follow_all(
            streets,
            callback=self.parse_street,
        )

    def parse_street(self, response):
        rows = response.xpath("//table/tbody/tr")
        street_id = generate(size=10)
        if not rows:
            info = response.css("p")
            yield from self.parse_street_unique_cpa(info, street_id)
        else:
            for row in rows:
                yield from self.parse_street_multiple_cpa(row, street_id)

    def parse_street_unique_cpa(self, info, street_id):
        street = StreetLoader(item=StreetItem(), selector=info)
        number = NumberLoader(item=NumberItem(), selector=info)
        street.add_value("street_id", street_id)
        street.add_value("_inner_category", "streets")
        street.add_css("name", "em:nth-child(1)::text")
        # Number
        number.add_value("_inner_category", "numbers")
        number.add_value("street_id", street_id)
        number.add_value("from_number", "-")
        number.add_value("until_number", "-")
        number.add_css("zip_code", "strong::text")

        yield number.load_item()
        yield street.load_item()

    def parse_street_multiple_cpa(self, row, street_id):
        street = StreetLoader(item=StreetItem(), selector=row)
        number = NumberLoader(item=NumberItem(), selector=row)
        street.add_value("street_id", street_id)
        street.add_value("_inner_category", "streets")
        street.add_css("name", "td:nth-child(1)::text")
        # Number
        number.add_value("_inner_category", "numbers")
        number.add_value("street_id", street_id)
        number.add_css("from_number", "td:nth-child(2)::text")
        number.add_css("until_number", "td:nth-child(3)::text")
        number.add_css("zip_code", "td:nth-child(6) a::text")

        yield number.load_item()
        yield street.load_item()
