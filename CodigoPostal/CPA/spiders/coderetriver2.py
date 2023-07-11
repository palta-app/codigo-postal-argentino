import scrapy


class Coderetriver2Spider(scrapy.Spider):
    name = "coderetriver2"
    allowed_domains = ["codigo-postal.co"]
    start_urls = ["https://codigo-postal.co/argentina/"]


    def parse(self, response):
        provincias = response.css('.column-list a') 
        for provincia in provincias: 
            yield response.follow(str(provincia.css('::attr(href)').get()), callback=self.localidad)

#iteracion localidades
    def localidad(self, response):
        localidades = response.css('.cities a')
        for localidad in localidades:
            yield response.follow(str(localidad.css('::attr(href)').get()), callback=self.tablas)

#datos finales localidades con un solo cpa
    def tablas(self, response):
        calles = response.css('table tbody tr')
        for calle in calles: #para cada fila en filas
            if str(calle.css('td a::text').get()) == 'Buscar CPA':
                yield response.follow(str(calle.css('td a::attr(href)').get()), callback=self.info)
            

    def info(self, response):
        datos = response.css('.question ul li a')
        for dato in datos:
            yield response.follow(str(dato.css('::attr(href)').get()), callback= self.BuscarCPA)

    def BuscarCPA(self, response):
        filas = response.css('table tbody tr')
        for fila in filas:
            x = fila.css('td')
            yield{
                'cp': x[4].get(),
                'cpa': fila.css('::attr(data-cpa)').get(),
                'calle_avenida': x[0].get() ,
                'desde': x[1].get(),
                'hasta': x[2].get(),
                'aplica': x[3].get()              
            }

