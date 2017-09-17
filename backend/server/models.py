from server import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), index=True)
    age = db.Column(db.Integer, index=True)
    email = db.Column(db.String(128), index=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password = db.Column(db.String(64), index=True)
    journeys = db.relationship('Journey', backref='author', lazy='dynamic')

    def __repr__(self):	
        return "ID: {} | Name: {} | Age: {} | Email: {} | Username: {} | Password: {}".format(self.id, self.name, self.age, self.email, self.username, self.password)


class Journey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    cost = db.Column(db.Float, index=True)
    stops = db.relationship('Stop', backref='author', lazy='dynamic')

    def __repr__(self):
        return "ID: {} | User ID: {} | Start Date: {} | End Date: {} | Cost: {}".format(self.id, self.user_id, self.start_date, self.end_date, self.cost)


class Stop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('journey.id'))
    stop_name = db.Column(db.String(128), index=True)
    stop_rating = db.Column(db.Float, index=True)
    itineraries = db.relationship('Itinerary', backref='author', lazy='dynamic')

    def __repr__(self):
        return "ID: {} | Stop: {} | Rating: {}".format(self.id, self.stop_name, self.stop_rating)

class Itinerary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stop_id = db.Column(db.Integer, db.ForeignKey('stop.id'))
    day_of_event = db.Column(db.DateTime)
    places = db.relationship('Place', backref='author', lazy='dynamic')

    def __repr__(self):
        return "ID: {} | Stop ID: {} | Day Of Event: {}".format(self.id, self.stop_id, self.day_of_event)


class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itinerary.id'))
    place_name = db.Column(db.String(128), index=True)
    place_rating = db.Column(db.Float, index=True)

    def __repr__(self):
        return "ID: {} | Itinerary ID: {} | Place Name: {} | Rating: {}".format(self.id, self.itinerary_id, self.place_name, self.place_rating)

class StopInformation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_name = db.Column(db.String(128), index=True)
    data_type = db.Column(db.String(128))    
    cached_data = db.Column(db.LargeBinary)
    expiry = db.Column(db.DateTime)

    def __repr__(self):
        return f"ID: {self.id} | place: {self.place_name} | expiry: {self.expiry}"
    

"""
To add stuff:

>>> from server import db, models
>>> u = models.User(name='Bob', age=15, fav_fish='Tuna')
>>> db.session.add(u)
>>> db.session.commit()
>>> users = models.User.query.all()
>>> users
"""
