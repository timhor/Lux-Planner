from server import app
from flask import render_template, Response, jsonify
import json
from flask_cors import CORS, cross_origin
from flask_jwt import JWT, jwt_required, current_identity


CORS(app)

def authenticate(username, password):
	if username == user.username and password == user.password:
		return user

def identity(payload):
	return user

jwt = JWT(app, authenticate, identity)

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
		'message': 'How are you access me so insecurely!!'
		})

@app.route('/api/secure')
@jwt_required
def secure():
	return jsonify({
		'message': 'I am secured!',
		'identity': str(current_identity)
		})
