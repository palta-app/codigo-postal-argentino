# CPA Scraper

A scraper to collect a list of postal codes (CP) in Argentina in its new version.

### Demo Data

The demo files can be found in `local_data`.

Please note that the demo files are only a small part of the complete file, as
the complete file is too large. To view it in its entirety, you can use the
`make run` command.

When the scraper is executed, the output files have a format like `[name]/[name]_[%Y-%m-%dT%H-%M-%S].csv`.

### Data Model

**LocalityItem**

- `locality_id`: Unique identifier for the locality.
- `name`: Name of the locality.
- `zip_code`: Postal zip code associated with the locality.
- `state`: State in which the locality is located.

**StreetItem**

- `street_id`: Unique identifier for the street.
- `name`: Name of the street.
- `locality_id`: Identifier of the locality to which the street belongs.

**NumberItem**

- `street_id`: Identifier of the street to which the number belongs.
- `from_number`: Starting number in the range (or "-" if there is a unique CPA for the street).
- `until_number`: Ending number in the range (or "-" if there is a unique CPA for the street).
- `zip_code`: Postal zip code associated with the number range.

NOTE: Each custom item contains an `_inner_category` field, which is used in pipelines to perform specific tasks such as validations or removing duplicates. 
The internal category helps in organizing the data during the data processing pipeline.

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

You can use the following command to execute a spider (default=`localities`).

```
make run
```

If you don't have `make` installed, you can manually execute the commands
mentioned in the `Makefile` located in the project directory.

### TODO

- Limit the size of CSV files and split them into smaller files for easier
  handling and processing.
- Store the data in a database for efficient management and quick queries.
- Create an API to provide access to the scraper's results programmatically,
  allowing other developers to easily utilize and consume the data.
- Perform thorough debugging to identify any errors or duplicate records in the
  collected data. This will ensure the integrity and quality of the obtained data.
