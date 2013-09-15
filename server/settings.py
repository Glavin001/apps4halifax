#SERVER_NAME = '127.0.0.1:5000'
SERVER_NAME = '140.184.132.237:5000'
#SERVER_NAME = 'localhost:5000'

# Enable reads (GET), inserts (POST) and DELETE for resources/collections
# (if you omit this line, the API will default to ['GET'] and provide
# read-only access to the endpoint).
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']

# Enable reads (GET), edits (PATCH) and deletes of individual items
# (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'DELETE']

# We enable standard client cache directives for all resources exposed by the
# API. We can always override these global settings later.
CACHE_CONTROL = 'max-age=20'
CACHE_EXPIRES = 20

# The DOMAIN dict explains which resources will be available and how they will
# be accessible to the API consumer.
DOMAIN = {

    'Halifax' : {
        
        'schema': {
            'type': { 'type': 'string', 'required': True },
            'longitude': { 'type': 'float', 'required': True },
            'latitude': { 'type': 'float', 'required': True },
            'meta': { 'type': 'dict' },
            'loc': { 'type': 'dict' }
        }
    }
}

# Let's just use the local mongod instance. Edit as needed.

# Please note that MONGO_HOST and MONGO_PORT could very well be left
# out as they already default to a bare bones local 'mongod' instance.
MONGO_HOST = '127.0.0.1' #'localhost'
MONGO_PORT = 27017
#MONGO_USERNAME = 'glavin'
#MONGO_PASSWORD = 'rules'
MONGO_DBNAME = 'test'
X_DOMAINS = "*"
X_HEADERS = "*"
URL_PREFIX = 'api'
PAGINATION_LIMIT = 100
PAGINATION_DEFAULT = 25
DEBUG = True