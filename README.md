<h1 align='center'>Codigo postal argentino</h1>

<h2>Reto o consigna inicial</h2>
<p>Conseguir el nuevo codigo CPA desde la pagina https://codigo-postal.co/ y cargarlos en archivos csv.</p>

<h2>Propuesta de solucion</h2>
<p>La propuesta es usar scraping para conseguir los codigos que estan alojados en tablas desde diferentes endpoints despues se procedera a transformarlos y por ultimo a cargarlos en un csv.</p>

<h3>Herramientas</h3>
<p><img src='img/pythonLogo.png' width=20 height=20> &nbsp Python</p>
<p><img src='img/scrapy.png' width=20 height=20> &nbsp Scrapy</p>
<p><img src='img/pandasLogo.png' width=45 height=20> &nbsp Pandas</p>

<p>Se usaran spiders para navegar por todos los links que contienen datos.</p>


<h2>Complicaciones</h2>
<ul>
    <li>Diseño de pagina heterogenio: La pagina no es consistente en sus etiquetas html y css, ya que se encontraron al menos 4 diseños lo que dificulto el armado de las spiders. </li>
    <li>Nombres de localidades mal escritos: Algunos nombres de localidades estaban mal escritos lo que conllevo mas trabajo en pandas.</li>
    <li>Tamaño de csv muy grande: El tamaño del csv es de casi 1gb.</li>
</ul>


<h2>Conclusiones y solucion</h2>

<p>Se utilizarion 2 spiders para scrapear la informacion, se hizo un trabajo de transformacion en pandas de datatype, orden e eliminacion de datos erroneos, faltantes o mal obtenidos.</p>

<p>Para el problema de la memoria se uso un sistema de compresion para transformar el archivo .csv de 1gb de tamaño a un archivo .parquet usado en bigdata de 42mb.</p>

<pre>
total_filas = 11316956
total_columnas = 8
archivos_parquet = 2
tamaño_archivos_parquet = 19.4mb, 21.6mb
csv_final_descomprimido = 944mb
</pre>

<h2>Conversor parquet a csv</h3>
<p>Para convertir el archivo .partque a .csv se tiene que ejecutar el script de python <b> conversor.py </b>.</p>
<pre>
pip install -r requirements.txt
python3 conversor.py
</pre>
