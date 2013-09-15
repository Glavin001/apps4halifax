from flask import request
from eve import Eve
app = Eve()

@app.before_request
def before():
    print('the request object ready to be processed:', request)

@app.after_request
def after(response):
    """
    Your function must take one parameter, a `response_class` object and return
    a new response object or the same (see Flask documentation).
    """
    print('and here we have the response object instead:', response)
    return response

@app.route("/gotime/<gotime>")
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

#@app.route("/")
#def index():
#        return "Hey, you need to specify a stop number!"


if __name__ == '__main__':
    app.run(host='0.0.0.0')
