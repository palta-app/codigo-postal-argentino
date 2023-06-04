import json

archivo_txt = './output.txt'
data = []

with open(archivo_txt, 'r') as archivo:
  data = [line.strip() for line in archivo]

diccionario = {clave: clave for clave in data}

json_data = json.dumps(diccionario, indent=4)

archivo_json = 'data.json'

with open(archivo_json, 'w') as archivo:
    archivo.write(json_data)

print(f'Se ha creado el archivo JSON: {archivo_json}')