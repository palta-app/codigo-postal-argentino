# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
# from itemadapter import ItemAdapter
import sqlite3

class SQLitePipeline(object):
    def open_spider(self, spider):
        self.connection = sqlite3.connect('test_cpa.sqlite')
        self.cursor = self.connection.cursor()
        query_l = '''CREATE TABLE IF NOT EXISTS localities
                    (locality VARCHAR(120), CPA VARCHAR(50), 
                    link VARCHAR(300), city VARCHAR(120), state VARCHAR(60))'''
        
        queries_st = '''CREATE TABLE IF NOT EXISTS streets
                        (locality VARCHAR(120), street VARCHAR(200), number VARCHAR(20),
                         CPA VARCHAR(50), link VARCHAR(300), city VARCHAR(120), state VARCHAR(60))'''

        queries = [query_l, queries_st]
        for q in queries:
            self.cursor.execute(q)
        
    def process_item(self, item, spider):
        insert_l = '''INSERT INTO localities (locality, CPA, link, city, state) VALUES (?, ?, ?, ?, ?)'''
        insert_st = '''INSERT INTO streets (locality, street, number, CPA, link, city, state)
                        VALUES (?, ?, ?, ?, ?, ?, ?)'''
        
        for name, cpa, link, city, state in zip(item['localities'], item['CPA'], item['CPA_links'], item['city'], item['state']):
            self.cursor.execute(insert_l, (name, cpa, link, city, state))

        for loc, stt, nu, cpa, link, city, state in zip(item['st_local'], item['street'], item['street_number'],
                                                       item['street_cpa'], item['street_link'],
                                                       item['st_city'], item['st_state']):
            
            self.cursor.execute(insert_st, (loc, stt, nu, cpa, link, city, state))

        return item

    def close_spider(self, spider):
        self.connection.commit()  
        self.connection.close()
