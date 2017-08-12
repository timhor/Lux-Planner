from server import app
from flask import render_template, Response, jsonify
import json
from flask_cors import CORS, cross_origin
from flask_jwt import JWT, jwt_required, current_identity


CORS(app)

class Dummy:
	def __init__(self, id, username, password):
		self.id = id
		self.username = username
		self.password = password
	def __str__(self):
		return "User(id='%s')" % self.id

user = Dummy(id=1, username='bob', password='smith')


def authenticate(username, password):
	if username == user.username and password == user.password:
	# if True:
		print("AUTHENTICATED!!!")
		return user

def identity(payload):
	return user

jwt = JWT(app, authenticate, identity)

'''
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Methods'] = 'DELETE, GET, POST, PUT'
        headers = request.headers.get('Access-Control-Request-Headers')
        if headers:
            response.headers['Access-Control-Allow-Headers'] = headers
    return response
'''

@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')


@app.route('/user/<auth>')
def auth_route(auth):
    if auth != 'favicon.ico':
        print(auth)
    return render_template('user.html', name=auth)

@app.route('/admin/registered-users')
def registered_users():
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
@jwt_required
def secure():
	return jsonify({
		'message': 'I am secured!',
		'identity': str(current_identity)
		})

'''
@app.route('/auth', methods=['POST'])
def login():
	print("Hello there.")
	return "Hello"
'''