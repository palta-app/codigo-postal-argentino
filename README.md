# CPA Scraper

A scraper to collect a list of postal codes (CP) in Argentina in its new version.

### Demo Data

The demo files can be found in `local_data`.

### Setup

Tested with Python 3.10 using a virtual environment:

```
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip && \
  pip install -r requirements.txt
```

### Available Commands

To format the code, you can use the following command:

```
make format
```

To run linting, you can use the following command:

```
make lint
```

If you don't have `make` installed, you can manually execute the commands
mentioned in the `Makefile` located in the project directory.
