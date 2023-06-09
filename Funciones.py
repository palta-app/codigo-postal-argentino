'''
Módulo con funciones
'''

# Importaciones
from bs4 import BeautifulSoup
import requests
import time



def getSoup(url_soup:str, 
            label:str, 
            attr:str, 
            value:str, 
            label_alt:str='', 
            attr_alt:str='',
            value_alt:str=''):
    '''
    Envía solicitud https y espera respuesta

    url -> URL de la solicitud
    label -> Etiqueta a buscar en el doc HTML
    attr -> Atributo de la etiqueta HTML
    '''
    control = True
    while control:
        try:
            time.sleep(3)
            resp = requests.get(url_soup)
            
            # Nos aseguramos que obtenemos lo que esperamos
            soup = BeautifulSoup(resp.content,"html.parser")
            data = soup.find(label, attrs={attr : value})
            if(data == None):
                if(label_alt != ''):
                    data_alt = soup.find(label_alt, attrs={attr_alt : value_alt})
                    if(data_alt != None):
                        control = False
            else:        
                control = False

        except Exception as e:
            print(f'getSoup: {e}, reintentando...')
            time.sleep(6)

    return soup



def cargarCalles(sin_cpa:dict, url_calles:str, zona:str) -> None:
    '''
    Guarda los datos de las calles

    sin_cpa -> Diccionario con CPA a buscar
    url -> URL donde buscar las calles con sus CPA
    zona -> Lugar al que pertenecen las calles
    '''
    sin_cpa[zona] = {}

    soup = getSoup(url_calles, 'ul', 'class', 'three_columns')

    calles = soup.find('ul', attrs={'class':'three_columns'}).find_all('li')

    # Iteramos las calles del lugar
    for calle in calles:
        nom_calle = calle.get_text()

        # Si la calle ya existe entre las que procesamos,
        # agregamos un prefijo a la calle para diferenciarla
        num_adicional = 1
        while nom_calle in sin_cpa[zona].keys():
                nom_calle = nom_calle + ' ' + str(num_adicional)
                num_adicional += 1

        sin_cpa[zona][nom_calle] = {}

        print(f'Procesando la calle: {nom_calle}')

        # Obtenemos el tipo y el nombre de la calle
        posHasta_nomCalle = nom_calle.find(' ')
        tipo_calle = nom_calle[ : posHasta_nomCalle]
        if (tipo_calle in ['Ruta', 'ruta']):
            posDesde_nomCalle = posHasta_nomCalle + 1
            posHasta_nomCalle = nom_calle.find(' ', posDesde_nomCalle)
            tipo_calle = nom_calle[ : posHasta_nomCalle]
        solo_nomCalle = nom_calle[posHasta_nomCalle + 1 : ]

        sin_cpa[zona][nom_calle]['tipo'] = tipo_calle
        sin_cpa[zona][nom_calle]['nombre'] = solo_nomCalle

        link = calle.find_all('a', href=True)
        url_alturas = link[0]['href']

        control = True
        while control:
            try:
                time.sleep(3)
                resp = requests.get(url_alturas)
                soup = BeautifulSoup(resp.content,"html.parser")
                tabla_calle = soup.find('table', attrs={'id':'id_table_cpa'})
                if(tabla_calle == None):
                    cpa_unico = soup.find('strong').get_text()
                    if(cpa_unico != None):
                        control = False
                else:
                    control = False

            except Exception as e:
                print(f'cargarCalles: {e}, reintentando...')
                time.sleep(6)

        # Si hay tabla con diferentes CPA para la calle
        if(tabla_calle != None):
            filas_calle = tabla_calle.find_all('tr')
            head = True
            alias_buscado = False
            for fila in filas_calle:
                if(not head):
                    datos_calle = fila.find_all('td')

                    cpa = datos_calle[5].get_text()
                    sin_cpa[zona][nom_calle][cpa] = {}

                    # Guardamos los datos de la calle en el diccionario
                    sin_cpa[zona][nom_calle][cpa]['desde'] = datos_calle[1].get_text()
                    sin_cpa[zona][nom_calle][cpa]['hasta'] = datos_calle[2].get_text()
                    sin_cpa[zona][nom_calle][cpa]['par_impar'] = datos_calle[3].get_text()

                    # Buscamos nombre alternativo de la calle
                    # Verificamos si ya lo buscamos
                    if (not alias_buscado):
                        alias_buscado = True
                        
                        link = datos_calle[5].find_all('a', href=True)
                        url = link[0]['href']
                        
                        # Página con posibles nombres alternativos
                        soup = getSoup(url, 'div', 'class', 'table-responsive', 
                                            'div', 'class', 'question')

                        tabla_alias = soup.find('div', attrs={'class':'table-responsive'})
                        if(tabla_alias != None):
                            filas_alias = tabla_alias.find_all('tr')
                            idx_fila = 0
                            for fila in filas_alias:
                                # Evitamos el encabezado de la tabla
                                if idx_fila > 0:
                                    celdas_alias = fila.find_all('td')
                                    alias = celdas_alias[3].get_text()
                                
                                    # Guardamos el nombre alternativo de la calle
                                    if(nom_calle != alias):
                                        sin_cpa[zona][nom_calle]['alias'] = alias

                                idx_fila += 1
                else:           
                    head = False
        else:
            # Si hay un único CPA para toda la calle
            sin_cpa[zona][nom_calle][cpa_unico] = cpa_unico



def formarId(num:int) -> str:
    '''
    Agrega 0 delante del id y lo convierte a str

    num -> Id a convertir
    '''
    ceros = '0' * (8 - len(str(num)))
    id_str = ceros + str(num)
    
    return id_str