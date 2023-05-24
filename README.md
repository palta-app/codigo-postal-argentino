# Scraping Challenge 

Buenas en Palta App estamos teniendo un problema y es que no existe una API que proporcione con exactitud una consulta de CPA (Codigo Postal Argentino) en su nueva version de 8 caracteres ( ejemplo M5500BBA ), para ello hemos pensando que tal vez la solucion sea armar un scrap para consultarlo o descargar la data dentro de alguna web y poder almacenarla para compartirla con la comunidad Argentina.

# Que es CPA ?
Codigo Postal Argentina es una nueva verision del codigo postal argentino requerido por varias entidades regulatorias, el mismo se compone de tres partes:

`A 1234 XYZ`

1. Un prefijo de una letra que simboliza el Estado/Provincia donde se encuentra la localidad
2. Cuatro numeros referenciando el codigo postal de la localidad ( el viejo y conocido CP, ejemplo en Mendoza es: 5500 ) 
3. Un sufijo de tres letras que refieren: la cada de una manzana y el lado ( por eso si es par o no lo es ).

Ejemplo real es el CPA M5500AAA que pertenece a Avenida Gral San Martin a todos los números impares entre los números 1 a 99 en Mendoza, provincia Mendoza, Argentina

El desafio esta en generar una DB o CSVs con los CPAs que existen en la actualidad

# About Challange

Hemos encontrado la web: https://codigo-postal.co/ que permite consultar sobre CPA con distintos endpoints como:
- consultado via paises, provincia, localidad y calles: https://codigo-postal.co/argentina/mendoza/mendoza/12-de-febrero/
- consultando directamente al CPA: https://codigo-postal.co/argentina/cpa/M5500FHA/

## Una alternativa

Pensamos como una alternativa ir scrappeando y consultando con el endpoint [`https://codigo-postal.co/argentina/cpa/M5501AAB/`](https://codigo-postal.co/argentina/cpa/M5501AAB/) el cual nos permite consultar un CPA y poder ver la info que nos devuelve. Esta info incluye:

- calle
- numercion
- localidad
- si la numeracion es PAR o IMPAR

## steps

1. Iterar los zipcode de 4 numeros. ( fuente de **[Listado de Códigos Postales de Argentina](https://www.escribaniavildosola.com.ar/Codigos-Postales-Argentina.xlsx) )**
2. obtener todos los **states** que devuelve zippo
3. por cada state iterar con sufijos ( AAA → ZZZ ) y consultando a https://codigo-postal.co/ 

Esta problematica puede presentar OTRO problema as y es que dando un estimado de la cantidad de CPA posibles podemos tener:

Escenario 1: que se esten utilizando TODOS los sufijos ( AAA -> ZZZ ), lo que nos daria una cantidad de `27 ** 3 * 3449 = 67.886.667` de CPAs ( un numerito )
Escenario 2: que se esten utiliznado ALGUNOS sufijos por localidad, lo que reduce la posiblidad entre un 70% y 50%, quedando entre 20.366.000 y 33.943.333 de CPAs
Escenario 3: que se esten utiliznado POCOS sufijos por localidad, lo que reduce la posiblidad en un 90% (lo que puede ser muy probable, pero no seguro que sea asi) quedando un total de 7.000.000 de CPAs 

# Resultado buscado

Ejemplo de estrucutra a seguir en DB o CSV:

- localities: {
  "id": "00011436",
  "name": "agua sucia",
  "zip": "a4449xaa",
  "district": "anta",
  "state": "salta"
}
- streets: {
  "streetId": "00014291",
  "type": "ruta provincial",
  "name": "*",
  "reference": "tab",
  "alternativeName": "2",
  "localityId": "00001120",
  "neighborhood": "tab"
}
- numbers: {
  "streetId": "00014284",
  "isOdd": false,
  "from": 1,
  "until": 2,
  "zip": "s3077aaa"
}
 

# Duration

El desafio dura dos una semana, por lo general de viernes a viernes ( medio-dia )

# Retribucion

Por completar el desafio 50.000 ARS 
con posibilidades de bonus de hasta 25.000 ARS (depende en la forma en que llego a la solucion y como se escribre el codigo)
