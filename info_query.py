import sqlite3

path = './localities/local_cpa.sqlite'
# path = './postal_code.sqlite'
connection = sqlite3.connect(path)
cursor = connection.cursor()

cursor.execute("SELECT COUNT(*) FROM localities")
rows1 = cursor.fetchall()

cursor.execute("SELECT COUNT(*) FROM streets")
rows2 = cursor.fetchall()

cursor.execute('''SELECT * FROM localities 
                    ORDER BY city DESC
                    LIMIT 10''')
rows3 = cursor.fetchall()

cursor.close()
connection.close()

# for row in rows1:
    # print(row)
print(rows1)

# for row in rows2:
print(rows2)

for row in rows3:
    print(row)