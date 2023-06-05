install:
	pip install --upgrade pip && \
		pip install -r requirements.txt
format:
		# black *.py
lint:
		# pylint *.py
all: install format lint