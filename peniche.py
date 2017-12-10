from flask import Flask
from flask import render_template
from flask import request
import requests 
import json
from rdflib import Graph, Literal, BNode, Namespace, RDF, URIRef
from flask_cors import CORS
app = Flask(__name__,static_url_path='/static')
CORS(app)

jinja_options = app.jinja_options.copy()

jinja_options.update(dict(
    block_start_string='<%',
    block_end_string='%>',
    variable_start_string='%%',
    variable_end_string='%%',
    comment_start_string='<#',
    comment_end_string='#>'
))
app.jinja_options = jinja_options

@app.route("/")
def hello():
	return render_template('index.html')

def getName(s):
	name = s[s.rfind("/")+1:]
	return name

@app.route("/getResource")
def getResource():
	url = request.args.get('url')
	

	g = Graph ()
	g.parse(url,format="turtle")

	query = """
	PREFIX pk: <http://opensensingcity.emse.fr/ontologies/parking/>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	SELECT ?parking ?nbCarAv ?nbMotocycleAv ?nbBicycleAv ?lat ?long ?label
	WHERE {
		?parking a pk:ParkingFacility .
		OPTIONAL { ?parking rdfs:label  ?label . }
		OPTIONAL { ?parking pk:nbCarParkingPlaces ?nbCarAv . }
		OPTIONAL { ?parking pk:nbBicycleParkingPlaces ?nbBicyleAv . }
		OPTIONAL { ?parking pk:nbMotorcycleParkingPlaces ?nbMotocycleAv . }
		OPTIONAL { ?parking pk:nbBicycleParkingPlaces ?nbBicycleAv . }
		OPTIONAL { ?parking geo:lat ?lat . }
		OPTIONAL { ?parking geo:long ?long . }
	} """
	results = g.query(query)
	parkings = {}
	for result in results:
			parking = {}

			parking["iri"] = result[0]
			parking["carAV"] = result[1]
			parking["motoAV"] = result[2]
			parking["bicyleAV"] = result[3]
			parking["geoLat"] = float(result[4])
			parking["geoLong"] = float(result[5])
			parking["label"] = result[6]

			parkings[parking["iri"]] = parking
	
	return json.dumps(parkings)
	

if __name__ == "__main__":
	app.debug = True
	app.run(host= '0.0.0.0',port=5051)
