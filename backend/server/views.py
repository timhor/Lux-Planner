from server import app, api_handler
from flask import render_template, Response, jsonify, request
# import json
from flask_cors import CORS, cross_origin
from flask_jwt import JWT, jwt_required, current_identity #, payload_handler


CORS(app)


# TODO REMOVE WHEN CONNECTED TO DATABASE
class Dummy:
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password
    def __str__(self):
        return "User(id='%s')" % self.id

user = Dummy(id=1, username='bob', password='smith')
# End Test data

def authenticate(username, password):
    """ Used to authenticate the user based on the database
        @param username: Username given
        @param password: Password given
        @return: the user that matches both username and password
            else return None
    """
    if username == user.username and password == user.password:
        print("AUTHENTICATED!!!")
        return user

def identity(payload):
    """ TODO What this do idk, just need it """
    print(payload)
    return user



jwt = JWT(app, authenticate, identity)
'''
@jwt.payload_handler
def make_payload(identity):
    return {'user_id': "HELLLOOOOOOO"}
'''

@app.route('/')
@app.route('/index')
def index():
    """ Front page of the backend """
    return render_template('index.html')


@DeprecationWarning
@app.route('/user/<auth>')
def auth_route(auth):
    """ User page """
    if auth != 'favicon.ico':
        print(auth)
    return render_template('user.html', name=auth)

@app.route('/admin/registered-users')
def registered_users():
    """ Registered user page """
    admin_name = 'adminny'
    fake_regi = [
        {'name': 'James',
         'age': '17',
         'fav_fish': 'Salmon'
        },
        {'name': 'Kevin',
         'age': '91',
         'fav_fish': 'Tuna'
        },
        {'name': 'Blake',
         'age': '45',
         'fav_fish': 'I\'m a vegan goddammit'
        }
    ]
    return render_template('registered-users.html', admin=admin_name, users=fake_regi)


@app.route('/api/flickr/', methods=['GET'])
def flickr(): # REST params: ([search], [results])
    """ Returns a list of images from the Flickr search
        @param search: the search string to give Flickr
        @param results: Search result range to return. Can be single number or range
            e.g. results=10 or results=2-8
        @return: The searched data. If no range of results is provided, the raw
            response from Flickr is given
	"""
    search = request.args.get('search', 'Paris')
    results = request.args.get('results', None)
    try:
        data = api_handler.search_flickr(search)
        if results is None:
            return jsonify(data)

        # TODO handle multiple results as a return of list of urls
        urls = []
        if '-' in results:
            start, end = results.split('-')
            start, end = int(start), int(end)
            end += 1
        else:
            start = int(results)
            end = start + 1

        for entry in range(start, end):
            photo = data['photos']['photo'][entry]
            # https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
            farm_id = photo['farm']
            server_id = photo['server']
            photo_id = photo['id']
            secret_id = photo['secret']
            url = "https://farm{}.staticflickr.com/{}/{}_{}.jpg".format(farm_id, server_id, photo_id, secret_id)
            urls.append(url)
        return jsonify({"images" : urls})
    except:
        return "Error"


@app.route('/api/hello', methods=['GET'])
def hello():
    fake_regi = [
        {'name': 'James',
         'age': '17',
         'fav_fish': 'Salmon'
        },
        {'name': 'Kevin',
         'age': '91',
         'fav_fish': 'Tuna'
        },
        {'name': 'Blake',
         'age': '45',
         'fav_fish': 'I\'m a vegan goddammit'
        }
    ]
    data = jsonify(fake_regi)
    print("I am sending!")
    print(data)
    # return Response(data)
    return data

@app.route('/api/insecure')
def insecure():
    return jsonify({
        'message': 'How dare you access me so insecurely!!'
        })

@app.route('/api/secure')
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def secure():
    print("Secured?")
    return jsonify({
        'message': 'I am secured! My ID is ' + str(current_identity),
        'identity': str(current_identity)
        })


@app.route('/api/new_user', methods=['POST'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
def new_user():
    print(request)
    # username = request.form['username']
    # password = request.form['password']
    return None
