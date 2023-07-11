import pandas as pd

data1 = pd.read_parquet('codigosCPA_1.parquet')
data2 = pd.read_parquet('codigosCPA_2.parquet')

dataf = pd.concat([data1, data2])

dataf.to_csv('codigosCPA.csv', index=False)