from server import app
from flask import render_template

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