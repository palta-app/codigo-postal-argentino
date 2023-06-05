install:
	pip install --upgrade pip && \
		pip install -r requirements.txt
format:
		black cpa_scraper/*.py
lint:
		pylint --disable=R,C cpa_scraper/*.py
all: install format lint