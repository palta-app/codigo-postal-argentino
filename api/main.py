from fastapi import FastAPI
import pandas as pd

app = FastAPI()

#Como primer paso se importan las 3 partes de los csv y se combinan en un solo dataframe.
parte1 = pd.read_csv("api/cpa_csv/complete_cpa_data_part1.csv")
parte2 = pd.read_csv("api/cpa_csv/complete_cpa_data_part2.csv")
parte3 = pd.read_csv("api/cpa_csv/complete_cpa_data_part3.csv")

df = pd.concat([parte1, parte2, parte3])

#Este endpoint toma un codigo cpa y devuelve toda la informacion de ese codigo.
@app.get("/datos_cpa/{cpa}")
def obtener_datos_cpa(cpa: str):
    datos = df.loc[df["cpa"] == cpa.upper()]
    alturas_desde = datos["altura_desde"].astype(int)
    datos = datos.astype(str)
    
    if any(altura % 2 != 0 for altura in alturas_desde):
        mensaje = "Todos los numeros impares en: "
    else:
        mensaje = "Todos los numeros pares en: "
        
    return {
        "Tipo de numero": mensaje,
        "Datos": datos.to_dict(orient="records")
    }

#Este endpoint devuelve el codigo cpa correspondiente a la provincia, partido, localidad, calle y numero especificado.
@app.get("/buscar_cpa")
def buscar_cpa(provincia: str, partido:str, localidad: str, calle: str, numero: int):
    filtro = (
        (df["provincia"] == provincia.upper())
        & (df["partido"] == partido.upper())
        & (df["localidad"] == localidad.upper())
        &
        (
            (df["nombre_completo_calle"] == calle.upper()) |
            (df["nombre_abreviado_calle"] == calle.upper())
        )
        & (df["altura_desde"] <= numero)
        & (df["altura_hasta"] >= numero)
    )
    
    datos = df.loc[filtro]
    
    if numero % 2 == 0:
        datos = datos[(datos["altura_desde"] % 2 == 0)]
    elif numero % 2 != 0:
        datos = datos[(datos["altura_desde"] % 2 != 0)]
    elif numero == 0:
        datos = datos[(datos["altura_desde"] == 0)]

    return datos["cpa"].to_list()
