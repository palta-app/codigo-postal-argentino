.DEFAULT_GOAL := all

install:
	pip install --upgrade pip && pip install -r requirements.txt

format:
	black cpa_scraper/*.py

lint:
	pylint --disable=R,C cpa_scraper/*.py

run:
	scrapy crawl localities

all: install format lint
