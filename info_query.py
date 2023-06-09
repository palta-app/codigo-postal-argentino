import sqlite3

path = './postal_code.sqlite'
connection = sqlite3.connect(path)
cursor = connection.cursor()

cursor.execute("SELECT COUNT(*) FROM localities")
rows1 = cursor.fetchall()

cursor.execute("SELECT COUNT(*) FROM streets")
rows2 = cursor.fetchall()

cursor.close()
connection.close()

print(rows1)

print(rows2)