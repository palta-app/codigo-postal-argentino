<h1>CPA Test</h1>

Se hizo un BackEnd en nodejs y express. El mismo almacena en archivos json temporarios.
Luego los guarda en formato csv. Los archivos temporarios y resultantes estan en /JSON.
Los endpoints son:

<h1>/scrapper<h1>
1) Este endpoint dispara el inicio del proceso. Genera Archivos temporarios: 1-ListaGeneral.json y 2-PLocalidades.json. Luego genera para cada provincia un archivo donde estan todos los datos hasta el nivel de codigo postal CPA o datos del link a la pagina donde buscar (en caso de tener direccion de calles).

<h1>/csv</h1>
2) Este endpoint al dispararse toma los archivos temporales CPA (uno para cada provincia) generados en el endpoint anterior y luego de un proceso genera lso archivos csv LOCATIONS de salida (Tambien uno para cada provincia).

<h1>/streets</h1>
3) Este ultimo endpoint procesa tomar los archivos CPA creados en el punto 1 y los procesa tomando los links de cada localidad con calles. Los abre y recupera la info de las calles.
Al final genera los archivos STREETS y NUMBER (tambien uno para cada provincia).

Se tienen que usar estos endpoints en la secuencia descripta.

En las primeras corridas aparentemente el sitio bloqueaba el acceso muchas veces. Se utilizarons headers variables en la peticion axios. Tambien se agrego temporizadores entre los intentos de recuperar informacion.

Por falta de tiempo no se llego a contemplar la recuperacion de CABA (ligeramente diferente en la estructura de la pagina y la secuencia de busqueda) y en algunas ocasiones los archivos NUMBERS se grabaron vacios (pudo haber sido un problema en la recuperacion de la info de las calles.)




