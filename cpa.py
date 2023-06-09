'''
Módulo para la obtención de los CPA de la República Argentina
'''

# Importaciones
from bs4 import BeautifulSoup
import requests
import re
import time
from Funciones import getSoup, formarId, cargarCalles



def cargarProvincias() -> dict:
    '''
    Carga las provincias a procesar
    '''
    control = True
    while control:
        url = 'https://codigo-postal.co/argentina/'
        resp = requests.get(url)
        soup = BeautifulSoup(resp.content,"html.parser")

        data = soup.find('ul', attrs={'class':'column-list'}).find_all('li')
        provs = {}
        for i in range(len(data)):
            provincia = data[i].get_text()
            link = data[i].find_all('a', href=True)
            link = link[0].get('href')
            provs[provincia] = link

        if(provs != None):
            control = False

    return provs



def cargarLocalidades(provs:dict) -> dict:
    '''
    Carga las localidades de cada provincia

    provs -> Provincias de las cuales obtener las localidades
    '''
    # Itermaos hasta obtener las localidades de cada provincia
    ok = False
    while not ok:
        try:
            localidades = {}
            for prov in provs:
                url = provs[prov]
                resp = requests.get(url)
                soup = BeautifulSoup(resp.content,"html.parser")
                data = soup.find('ul', attrs={'class':'cities'}).find_all('li')
                localidades[prov] = {}
                for i in range(len(data)):
                    localidad = data[i].get_text()
                    link = data[i].find_all('a', href=True)
                    link = link[0].get('href')
                    localidades[prov][localidad] = link
        except:
            time.sleep(3)
        else:
            ok = True

    return localidades            



def obtenerCPAs(localidades:dict) -> None:
    '''
    Obtiene los CPA de localidades, calles
    con o sin diferentes CPA por altura y vereda par o impar
    '''
    ruta = 'csv/'

    loc_csv = 'localities.csv'
    loc_head = 'id,name,zip,sate'
    with open(ruta + loc_csv, 'a', encoding='utf-8') as f:
        f.write(loc_head + '\n')
        f.close()

    str_csv = 'streets.csv'
    str_head = 'id,type,name,reference,alternativeName,localityId,neighborhood'
    with open(ruta + str_csv, 'a', encoding='utf-8') as f:
        f.write(str_head + '\n')
        f.close()

    num_csv = 'numbers.csv'
    num_head = 'streetId,isOdd,from,until,zip'
    with open(ruta + num_csv, 'a', encoding='utf-8') as f:
        f.write(num_head + '\n')
        f.close()

    id_localidad = 1
    id_calle = 1

    provs_procesadas = []
    locs_procesadas = []

    finalizado = False
    while not finalizado:


        for prov in localidades:
            
            # Vemos si la provincia falta procesar
            if(prov not in provs_procesadas):

                for loc in localidades[prov]:

                    # Vemos si la localidad ya se procesó
                    if(loc not in locs_procesadas):

                        con_cpa = {}
                        sin_cpa = {}

                        url = localidades[prov][loc]
                        soup = getSoup(url, 'table', 'class', 'table-responsive', 
                                            'div', 'class', 'question')

                        tabla = soup.find('table', attrs={'class':'table-responsive'})
                        if(tabla != None):
                            # Hay sub regiones en la localidad
                            filas = tabla.find_all('tr')
                        else:
                            # Buscamos calles dado que no hay sub regiones en la localidad
                            filas = []

                            link = soup.find('div', attrs={'class':'question'}).find_all('a', href=True)
                            url = link[0]['href']
                            zona = loc

                            print(f'\nProcesando: {zona}')
                            cargarCalles(sin_cpa, url, zona)

                        # Boleana para evitar la fila del encabezado
                        header = True

                        # Si las hay, recorremos las sub regiones
                        for fila in filas:
                            # Si no es el encabezado, guardamos datos
                            if (not header):
                                zonas_data = fila.find_all('td')
                                zona = zonas_data[1].get_text()
                                cpa = zonas_data[3].get_text()

                                # Guardamos el enlace para cualquier texto que no sea el CPA
                                # ej: 'Buscar CPA' por si cambia en la web a futuro dicho texto
                                cpa_ok = re.findall('\A[A-Z]' # Que comience con una letra A - Z
                                                    '\d{4}' # Que contenga 4 dígitos
                                                    '[A-Z]{3}$' # Que finalice con 3 letras A - Z
                                                    , cpa)
                                if(cpa_ok):
                                    con_cpa[zona] = cpa
                                else:
                                    # Recorremos las calles
                                    link = fila.find_all('a', href=True)
                                    url = link[0]['href']
                                    
                                    print(f'\nProcesando: {zona}')
                                    cargarCalles(sin_cpa, url, zona)
                            else:
                                # Próxima vuelta no es encabezado
                                header = False

                        # Guardamos la localidad completada
                        with open(ruta + loc_csv, 'a', encoding='utf-8') as f_loc:
                            # Guardamos las con CPA única para la localidad
                            for _loc in con_cpa:
                                # Preparamos los datos a guardar
                                _id_loc_str = formarId(id_localidad)
                                _cpa = con_cpa[_loc]

                                f_loc.write(_id_loc_str +','+ _loc +','+ _cpa +','+ prov + '\n')

                                # Agregamos la localidad a la lista de procesadas
                                locs_procesadas.append(_loc)                                
                                
                                # Incrementamos el id de la localidad
                                id_localidad += 1

                            # Guardamos las localidades con calles
                            for _loc in sin_cpa:
                                # Preparamos los datos
                                _id_loc_str = formarId(id_localidad)
                                
                                f_loc.write(_id_loc_str +','+ _loc +','+ ','+ prov +'\n')

                                # Agregamos la localidad a la lista de procesadas
                                locs_procesadas.append(_loc)                                

                                # Incrementamos el id de la localidad
                                id_localidad += 1
                                
                                # Guardamos las calles
                                with open(ruta + str_csv, 'a', encoding='utf-8') as f_calle:
                                    for _calle in sin_cpa[_loc]:
                                        #Preparamos los datos
                                        _id_calle_str = formarId(id_calle)
                                        _tipo = sin_cpa[_loc][_calle]['tipo']
                                        _nombre = _calle
                                        _ref = sin_cpa[_loc][_calle]['nombre']
                                        # Vemos si la calle tiene alias
                                        if('alias' in sin_cpa[_loc][_calle].keys()):
                                            _alias = sin_cpa[_loc][_calle]['alias']
                                        else:
                                            _alias = ''
                                        
                                        f_calle.write(_id_calle_str +','+ _tipo +','+ _nombre +','+ _ref +','+ _alias +','+ _id_loc_str +',\n')                                    
                                        
                                        id_calle += 1

                                        # Guardamos los números de la calle
                                        with open(ruta + num_csv, 'a', encoding='utf-8') as f_num:
                                            for _llave in sin_cpa[_loc][_calle]:
                                                
                                                #Nos quedamos solo con los CPA
                                                if(_llave not in ['tipo', 'nombre', 'alias']):
                                                    # Si hay un dict, tiene varios CPA, sino
                                                    # un único CPA para toda la calle                                       
                                                    if(type(sin_cpa[_loc][_calle][_llave]) != dict):
                                                        _cpa = sin_cpa[_loc][_calle][_llave]
                                                        f_num.write(_id_calle_str +',all,0,99999999,'+ _cpa +'\n')

                                                    else:
                                                        _cpa = _llave
                                                        if(sin_cpa[_loc][_calle][_llave]['par_impar'] == 'números pares'):
                                                            _isOdd = 'false'
                                                        else:
                                                            _isOdd = 'true'
                                                        _desde = sin_cpa[_loc][_calle][_llave]['desde']
                                                        _hasta = sin_cpa[_loc][_calle][_llave]['hasta']

                                                        f_num.write(_id_calle_str +','+ _isOdd +','+ _desde +','+ _hasta +','+ _cpa +'\n')
                                                
                                            f_num.close()

                                    f_calle.close()

                            f_loc.close()
                
                # Agregamos la provincia a la lista de procesadas
                provs_procesadas.append(prov)

        finalizado = True







def main() -> None:
    provincias =  cargarProvincias()
    locs =  cargarLocalidades(provincias)
    obtenerCPAs(locs)





if __name__ == '__main__':
    main()