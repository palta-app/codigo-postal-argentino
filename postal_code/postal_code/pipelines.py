# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

# useful for handling different item types with a single interface
# from itemadapter import ItemAdapter

import sqlite3

class SQLitePipeline(object):
    def open_spider(self, spider):
        self.connection = sqlite3.connect('./../postal_code.sqlite')
        self.cursor = self.connection.cursor()
        query_c = '''CREATE TABLE IF NOT EXISTS Country
                    (id INTEGER, name VARCHAR(30))'''
        query_s = '''CREATE TABLE IF NOT EXISTS State
                    (id INTEGER, name VARCHAR(80), link VARCHAR(300))'''
        query_city = '''CREATE TABLE IF NOT EXISTS City
                        (id INTEGER, name VARCHAR(120), link VARCHAR(300), state VARCHAR(80))'''
        
        queries = [query_c, query_s, query_city]
        for q in queries:
            self.cursor.execute(q)
        
    def process_item(self, item, spider):
        insert_c = '''INSERT INTO Country (id, name) VALUES (?, ?)'''
        truncate_c = '''DELETE FROM Country'''

        insert_s = '''INSERT INTO State (id, name, link) VALUES (?, ?, ?)'''
        truncate_s = '''DELETE FROM State'''

        insert_city = '''INSERT INTO City (id, name, link, state) VALUES (?, ?, ?, ?)'''
        truncate_city = '''DELETE FROM City'''
        
        self.cursor.execute(truncate_c)
        for ii, name in enumerate(item['countries_names']):
            self.cursor.execute(insert_c, (ii, name))
        
        self.cursor.execute(truncate_s)
        for ii, name, link in zip(range(len(item['states_links'])), item['states_names'], item['states_links']):
            self.cursor.execute(insert_s, (ii, name, link))

        self.cursor.execute(truncate_city)
        for ii, name, link, state in zip(range(len(item['cities_names'])), item['cities_names'], item['cities_links'], item['city_state']):
            self.cursor.execute(insert_city, (ii, name, link, state))

        return item

    def close_spider(self, spider):
        self.connection.commit()  
        self.connection.close()