# Aclaraciones importantes (No llegue a terminarlo F)

Lamentablemente no pude llegar a terminar el reto, pero aun así me gustaría entregar lo que hice. La verdad me pareció super interesante y divertido de hacerlo. Realmente necesito mejorar la velocidad del scraper, aunque este proceso se haga 1 sola vez, ya que va página por página sacando la información, creo que debería ir de a 10 pestañas en simultaneo al menos. Además debo atomizar, modularizar y optimizar en términos generales el código.

Mi idea original era hacer un programa de consola interactivo que tenga 4 opciones:

-   Opción 1: `Popular los archivos (scraping) de todas las provincias, localidades y calles.`
-   Opción 2: `Consulta ingresando como información: Provincia, Localidad, Calle y Altura para obtener el CPA.`
-   Opción 3: `Consulta de la información ingresando el CPA.`
-   Opción 4: `Salir del programa.`

Seguramente lo termine en los próximos días, y actualice el README. Gracias por leer, un saludo!

# Solucion Challenge CPA por Luciano Piñol

Hola! Esta es mi solucion para obtener todos los CPA. Quiero aclarar que decidi escribir un nuevo archivo `localidades.csv`, dentro de `/src/data`, ya que he encontrado algunas fallas en el archivo original `localities`, buscando aleatoriamente y pensé que seria mejor reescribirlo, para asegurarme la veracidad de los datos.

Ejemplos de fallas encontradas:

### Falla 1 encontrada:

Error ortográfico, en lugar de la u con diéresis `ü` encontramos el signo `?`

<img src='./assets/falla-encontrada-1.png'/>

### Falla 2 encontrada:

Las localidades `Lesca` y `Tablada Oeste` se encuentra dentro de Entre Ríos y no de Corrientes.

<img src='./assets/falla-encontrada-2.png'/>
