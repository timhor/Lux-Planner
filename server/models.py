from server import db

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(128), index=True)
	age = db.Column(db.Integer, index=True)
	fav_fish = db.Column(db.String(64), index=True)

	def __repr__(self):
		return "ID: {} | Name: {} | Age: {} | Favourite Fish: {}".format(self.id, self.name, self.age, self.fav_fish)

class Location(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	place_name = db.Column(db.String(128), index=True)
	rating = db.Column(db.Float, index=True)

	def __repr__(self):
		return "ID: {} | Place: {} | Rating: {}".format(self.id, self.place_name, self.rating)


"""
To add stuff:

>>> from server import db, models
>>> u = models.User(name='Bob', age=15, fav_fish='Tuna')
>>> db.session.add(u)
>>> db.session.commit()
>>> users = models.User.query.all()
>>> users
"""