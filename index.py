from flask import Flask
from flask import render_template
from flask import request
import requests 
import json
from rdflib import Graph, Literal, BNode, Namespace, RDF, URIRef
from flask_cors import CORS
import urllib2
import validators

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

def loadFromURL(g,url):
        if validators.url(url):
                if ".json" in url or "." not in url:
                        g.parse(data=loadData(url),format="turtle")
                elif ".xml" in url:
                        g.parse(url,format="xml")
                elif ".n3" in url:
                        g.parse(url,format="n3")
                elif ".ttl" in url:
                        g.parse(url,format="turtle")
                else:
                        g.parse(data=loadData(url),format="turtle")


cservice = "http://rdfvalidator.mybluemix.net/validate"
f = "application/ld+json"
t = "text/turtle"
headers = {"Content-Type":"application/x-www-form-urlencoded"}
def loadData(durl):
        data = urllib2.urlopen(durl).read()
        data = {"content":data,"from":f,"to":t}
        response = requests.post(cservice,data=data,headers=headers)
        return response.text



@app.route("/")
def hello():
	return render_template('index.html')

def getName(s):
	name = s[s.rfind("/")+1:]
	return name

@app.route("/getResource")
def getResource():
	static = request.args.get('static')
	dynamic = request.args.get('dynamic')

	g = Graph ()
	loadFromURL(g,static)
	loadFromURL(g,dynamic)

	query = """
	PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> 
	PREFIX grepark: <http://opensensingcity.emse.fr/data/parking/grenoble/> 
	PREFIX mv: <http://schema.mobivoc.org/> 
	PREFIX o: <http://opensensingcity.emse.fr/ontologies/availability/>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
	PREFIX sosa: <http://www.w3.org/ns/sosa/> 
	PREFIX xml: <http://www.w3.org/XML/1998/namespace> 
	PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

	SELECT ?parking ?label ?totalCapacity ?availableQty ?lat ?long ?bike ?car ?moto
	WHERE {
		?parking a mv:ParkingFacility .
		OPTIONAL { ?parking rdfs:label  ?label . }
		OPTIONAL { ?parking mv:totalCapacity ?totalCapacity . }
		OPTIONAL { ?parking o:availability/o:availableQuantity ?availableQty . }
		OPTIONAL { ?parking geo:lat ?lat . }
		OPTIONAL { ?parking geo:long ?long . }
		OPTIONAL { ?parking mv:numberOfBicycleParkingSpaces ?bike . }
		OPTIONAL { ?parking mv:numberOfCarParkingSpaces ?car . }
		OPTIONAL { ?parking mv:numberOfMotorbikeParkingSpaces ?moto . }
	} """
	results = g.query(query)
	parkings = []
	for result in results:
			parking = {}

			parking["iri"] = result[0]
			parking["label"] = result[1]
			parking["totalCapacity"] = result[2]
			parking["availableQty"] = result[3]
			parking["geoLat"] = float(result[4])
			parking["geoLong"] = float(result[5])
			parking["bike"] = result[6]
			parking["moto"] = result[7]
			parking["car"] = result[8]
			

			parkings.append(parking)
	
	return json.dumps(parkings)
	

if __name__ == "__main__":
	app.debug = True
	app.run(host= '0.0.0.0',port=5051)
