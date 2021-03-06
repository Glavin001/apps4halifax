from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
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


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

@app.route("/gotime/<gotime>")
@crossdomain(origin='*')
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
