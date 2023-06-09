import scrapy


class CoderetriverSpider(scrapy.Spider):
    name = "coderetriver"
    allowed_domains = ["codigo-postal.co"]
    start_urls = ["https://codigo-postal.co/argentina/"]

#iteracion provincias
    def parse(self, response):
        links_provincias = response.css('.column-list a::attr(href)') 
        for provincia in links_provincias: 
            yield response.follow(str(provincia.get()), callback=self.localidad)

#iteracion localidades
    def localidad(self,response):
        links_localidades = response.css('.cities a::attr(href)')
        for localidad in links_localidades:
            yield response.follow(str(localidad.get()), callback=self.tablas)

#datos finales localidades con un solo cpa
    def tablas(self, response):
        calles = response.css('table tbody tr')
        for calle in calles:
            datos = calle.css('td::text')
            yield{
                'Provincia':datos[0].get(),
                'Localidad':datos[1].get(),
                'calle_avenida': '',
                'desde':'',
                'hasta': '',
                'aplica': '',
                'cp':datos[2].get(),
                'cpa': calle.css('td a::text').get()
            }

#scrapy crawl coderetriver -O test.csv


