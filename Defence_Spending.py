from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'Defence-Spend')

# MONGODB_HOST = 'ds247121.mlab.com'
# MONGODB_PORT = 47121
# DBS_NAME = 'heroku_2jp49f92'
COLLECTION_NAME = 'Defence-Spend'


@app.route("/")
def index():
    """
    A Flask view to serve the main dashboard page.
    """
    return render_template("index.html")


@app.route("/countries.html")
def countries():
    return render_template("countries.html")


@app.route("/current.html")
def current():
    return render_template("current.html")


@app.route("/future.html")
def future():
    return render_template("future.html")


@app.route("/figures.html")
def spending():
    return render_template("figures.html")

@app.route("/spending_data")
def spending_data():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format.
    """

    # A constant that defines the record fields that we wish to retrieve.
    FIELDS = {
        '_id': False, 'country': True, 'year': True, 'spend': True
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGO_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        projects = collection.find(projection=FIELDS, limit=55000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(debug=True, host="0.0.0.0")
