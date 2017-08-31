from server import db

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(128), index=True)
	age = db.Column(db.Integer, index=True)
	email = db.Column(db.String(128), index=True)
	fav_fish = db.Column(db.String(64), index=True)
	username = db.Column(db.String(64), index=True, unique=True)
	password = db.Column(db.String(64), index=True, unique=True)
	trips = db.Column(db.String(128), index=True)

	def __repr__(self):	
		return "ID: {} | Name: {} | Age: {} | Email: {} | Favourite Fish: {} | username: {} | password: {} | trips: {}".format(self.id, self.name, self.age, self.email, self.fav_fish, self.username, self.password, self.trips)

class Location(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	place_name = db.Column(db.String(128), index=True)
	rating = db.Column(db.Float, index=True)
	popular_points = db.Column(db.String, index=True)

	def __repr__(self):
		return "ID: {} | Place: {} | Rating: {} | Popular Points: {}".format(self.id, self.place_name, self.rating, self.popular_points)


"""
To add stuff:

>>> from server import db, models
>>> u = models.User(name='Bob', age=15, fav_fish='Tuna')
>>> db.session.add(u)
>>> db.session.commit()
>>> users = models.User.query.all()
>>> users
"""
