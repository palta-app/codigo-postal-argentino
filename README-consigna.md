# Challenge Código Postal Argentino

## Intro

¡Buenas! En Palta estamos teniendo un problema y es que no encontramos una API que nos proporcione con exactitud una consulta para obtener un CPA (Código Postal Argentino) en su nueva versión de 8 caracteres (ejemplo M5500BBA), para ello hemos pensado que tal vez la solución sea armar un scraper para consultarlo o descargar la data dentro de alguna web y poder almacenarla para compartirla con la comunidad Argentina.

### ¿Qué es el CPA?

Código Postal Argentina es una nueva versión del código postal argentino comenzado a ser requerido, el mismo se compone de tres partes:

`A1234XYZ`

- A -> Un prefijo de una letra que simboliza el Estado/Provincia donde se encuentra la localidad
- 1234 -> Cuatro números referenciando el código postal de la localidad (el viejo y conocido CP, ejemplo en Mendoza es: 5500)
- XYZ -> Un sufijo de tres letras que refieren: la altura de una calle y cara de una manzana (es decir, si es par o impar).

Ejemplo real de CPA es: `M5500AAA` que pertenece a Avenida Gral San Martin a todos los números impares entre los números 1 a 99 en Mendoza, provincia Mendoza, Argentina

El desafío está en generar un script para poder obtener o consultar los CPAs que existen en la actualidad y guardarlo en documentos CSV.

Para ello hemos encontrado la web: [https://codigo-postal.co/](https://codigo-postal.co/) que permite consultar sobre CPA con distintos endpoints como:

- consultado vía países, provincia, localidad y calles: [https://codigo-postal.co/argentina/mendoza/mendoza/12-de-febrero/](https://codigo-postal.co/argentina/mendoza/mendoza/12-de-febrero/)
- consultando directamente al CPA: [https://codigo-postal.co/argentina/cpa/M5500FHA/](https://codigo-postal.co/argentina/cpa/M5500FHA/)

### Una alternativa

Pensamos como una alternativa se podrá ir scrapeando y consultando con el endpoint [`https://codigo-postal.co/argentina/cpa/M5501AAB/`](https://codigo-postal.co/argentina/cpa/M5501AAB/) el cual nos permite consultar un CPA y poder ver la info que nos devuelve. Esta info incluye:

- calle
- numeración
- localidad
- si la numeración es PAR o IMPAR

### Info adicional

Vas a poder encontrar en la carpeta `data` datos adicionales que pueden ayudarte:

1. localities.csv - Listado de Códigos Postales de Argentina
2. statesCode.json - Listo de código de cada provincia

Por otro lado, tener en cuenta que los sufijos puede ir desde AAA -> ZZZ

### Tener en cuenta

Esta problemática puede presentar OTRO problema y es que dando un estimado de la cantidad de CPA posibles podemos tener:

Escenario 1: que se estén utilizando TODOS los sufijos (AAA -> ZZZ), lo que nos daría una cantidad de `27 ** 3 * 3449 = 67.886.667` de CPAs (un numerito)

Escenario 2: que se estén utilizando ALGUNOS sufijos por localidad, lo que reduce la posibilidad entre un 70% y 50%, quedando entre 20.366.000 y 33.943.333 de CPAs

Escenario 3: que se estén utilizando POCOS sufijos por localidad, lo que reduce la posibilidad en un 90% (lo que puede ser muy probable, pero no seguro que sea así) quedando un total de 7.000.000 de CPAs

¿Cómo crees que se podría solucionar?

# Sobre los Resultados esperados

Ejemplo de estructura a seguir en DB o CSV:

localities:

```csv
id,name,zip,sate
00011436,agua sucia,a4449xaa,salta
```

streets:

```csv
id,type,name,reference,alternativeName,localityId,neighborhood
00014291,ruta provincial,ruta provincial 2tab,2,00001120,tab
```

numbers:

```csv
streetId,isOdd,from,until,zip
00014284,false,1,2,s3077aaa
```

# Inscripciones

Para sumarte al desafío es facil, sigue estos dos pasos:

1. Haz un FORK de este repo
2. Crea un PR con el título `[WIP] - lets do it 📬🥑` (puedes reemplazar `lets do it` con el título que prefieras)

_Solo los PR creados antes del inicio del challenge serán tomados en cuenta para los Premios_

# Duración

Inicio: El día viernes 2 de junio a las 12:00 UTC-03:00  
Cierre: El día viernes 9 de junio a las 12:00 UTC-03:00

# Entrega

Para la entrega debes sumar en tu PR la solución (código) y una muestra de la solución (los documentos CSV)

# Premios

Dentro de los PR aceptados, se elegirán a los tres mejores:

- 1er: un premio de 50.000 ARS
- 2do: un premio de 25.000 ARS

Se considerará al mejor PR a partir de principios como:

- La forma en cómo llegó a la solución
- Si usó convenciones
- Si aplicó principio de programación
- Si aplicó buenas prácticas en su código
- Legibilidad del código

@lilJuan4168