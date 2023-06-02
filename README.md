# Challenge Código Postal Argentino - Solución

Este documento describe la metodología propuesta para abordar el desafío del Código Postal Argentino, los pasos a seguir, las limitaciones y posibles problemas a resolver, así como las herramientas tecnológicas a utilizar y el formato de la solución final.

## Metodología

La metodología propuesta para resolver el desafío es la siguiente:

1. **Recopilación de datos**: Utilizar técnicas de web scraping para obtener los datos de los CPAs existentes. Se pueden utilizar herramientas como Beautiful Soup, Selenium o Scrapy para extraer información de la página web [https://codigo-postal.co/](https://codigo-postal.co/) y sus endpoints relevantes.

2. **Procesamiento de datos**: Limpiar y estructurar los datos obtenidos del web scraping. Esto implica eliminar información innecesaria, normalizar los formatos de los CPAs y organizar los datos en una estructura coherente.

3. **Enriquecimiento de datos**: Utilizar los datos adicionales proporcionados en la carpeta "data", como el listado de códigos postales de Argentina y el listado de códigos de cada provincia, para enriquecer los datos de los CPAs obtenidos. Esto permitirá tener una visión más completa y precisa de los códigos postales argentinos.

4. **Almacenamiento de datos**: Guardar los datos procesados y enriquecidos en un formato adecuado, como un archivo CSV. Esto permitirá compartir y utilizar los datos de manera más eficiente.

5. **Validación y verificación**: Realizar pruebas y verificaciones en los datos procesados para asegurarse de su calidad y consistencia. Esto implica verificar la integridad de los datos, eliminar duplicados y corregir posibles errores.

6. **Documentación**: Documentar el proceso de obtención y procesamiento de los CPAs en un README.md para facilitar la comprensión y reproducción del trabajo realizado.

## Pasos a seguir

A continuación se presentan los pasos a seguir para resolver el desafío:

1. Realizar el web scraping de la página [https://codigo-postal.co/](https://codigo-postal.co/) y sus endpoints relevantes para obtener los datos de los CPAs.
2. Procesar y limpiar los datos obtenidos, eliminando información innecesaria y normalizando los formatos de los CPAs.
3. Utilizar los datos adicionales proporcionados (localities.csv y statesCode.json) para enriquecer los datos de los CPAs.
4. Almacenar los datos procesados y enriquecidos en un archivo CSV.
5. Realizar pruebas y verificaciones en los datos para asegurar su calidad y consistencia.
6. Documentar el proceso de obtención y procesamiento de los CPAs en un README.md.

## Limitaciones y posibles problemas a resolver

Al abordar este desafío, pueden surgir las siguientes limitaciones y problemas:

1. **Limitaciones de la página web**: Es posible que la página [https://codigo-postal.co/](https://codigo-postal.co/) tenga restricciones de acceso o bloqueos automáticos para el scraping. Se deben implementar técnicas para manejar estas limitaciones, como el uso de proxies o tiempos de espera adecuados.



2. **Cambios en la estructura de la página web**: Si la estructura de la página [https://codigo-postal.co/](https://codigo-postal.co/) cambia, el web scraping podría romperse. Se debe monitorear regularmente la página y ajustar el scraper en consecuencia.

3. **Calidad de los datos obtenidos**: Los datos obtenidos a través del web scraping pueden contener errores o inconsistencias. Es importante realizar validaciones y verificaciones exhaustivas para garantizar la calidad de los datos.

4. **Problemas de escalabilidad**: Si el número de CPAs a obtener es muy grande, puede haber problemas de rendimiento y escalabilidad al realizar el web scraping y procesamiento de datos. Se deben implementar técnicas eficientes y optimizadas para manejar grandes volúmenes de datos.

## Estructura de los datos

La estructura de los datos de los CPAs puede seguir el siguiente formato:

```
{
  "calle": "Nombre de la calle",
  "numeracion": "Numeración de la calle",
  "localidad": "Nombre de la localidad",
  "paridad": "Paridad de la numeración (par o impar)",
  "provincia": "Nombre de la provincia",
  "codigo_postal": "Código Postal Argentino"
}
```

Esta estructura permite almacenar la información relevante de cada CPA de manera organizada y coherente.

## Herramientas tecnológicas

Para resolver este desafío, se pueden utilizar las siguientes herramientas tecnológicas:

- Python: Lenguaje de programación principal para desarrollar el web scraping y el procesamiento de datos.
- Bibliotecas de web scraping: Beautiful Soup, Selenium , Scrapy u otras bibliotecas de scraping para extraer los datos de la página web.
- Pandas: Biblioteca de Python para el manejo y procesamiento eficiente de los datos.
- CSV: Formato de archivo para almacenar los datos procesados en un formato tabular fácil de compartir y utilizar.

## Formato de la solución final

La solución final consistirá en un archivo CSV que contenga los datos procesados y enriquecidos de los CPAs. Cada registro en el archivo CSV representará un CPA y contendrá los campos relevantes, como la calle, la numeración, la localidad, la paridad, la provincia y el código postal.

Además del archivo CSV, se proporcionará un README.md documentando el proceso de obtención y procesamiento de los CPAs, incluyendo los pasos seguidos, las limitaciones y problemas abordados, y las herramientas tecnológicas utilizadas.

# Duración

Inicio: El día viernes 2 de junio a las 12:00 UTC-03:00  
Cierre: El día viernes 9 de junio a las 12:00 UTC-03:00

# Entrega

Para la entrega debes sumar en tu PR la solución (código) y una muestra de la solución (los documentos CSV)


