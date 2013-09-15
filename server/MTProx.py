from flask import Flask
app = Flask(__name__)

@app.route("/<gotime>")
def hello(gotime):
	import urllib2
	response = urllib2.urlopen('http://eservices.halifax.ca/GoTime/departures_small.jsf?goTime=' + gotime)
	print response.info()
	html = str(response.read())
	a = html.split('<table id=\"avl_main_form:departure_table\"' , 1)[1]
	a = "<table id=\"avl_main_form:departure_table\"" + a 
	a = a.split('</table>', 1)[0]
	a = a +'</table>'
	a = '<html><head></head><body>' + a + '</body></html>'
	response.close()  # best practice to close the file
	return a

@app.route("/")
def index():
	return "Hey, you need to specify a stop number!"


if __name__ == "__main__":
    app.run()
    