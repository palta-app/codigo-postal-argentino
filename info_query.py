import sqlite3

path = './localities/local_cpa.sqlite'
# path = './postal_code.sqlite'
connection = sqlite3.connect(path)
cursor = connection.cursor()

cursor.execute("SELECT COUNT(*) FROM localities")
rows1 = cursor.fetchall()

cursor.execute("SELECT COUNT(*) FROM streets")
rows2 = cursor.fetchall()

# cursor.execute('''SELECT name, link, state FROM City 
#                     WHERE state = "Buenos Aires" AND name LIKE "A%"
#                     ORDER BY state ASC''')
# rows1 = cursor.fetchall()

cursor.close()
connection.close()

# for row in rows1:
    # print(row)
print(rows1)

# for row in rows2:
print(rows2)