from server import db

class User(db.Model):
    """ User data schema """
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(128), index=True)
    last_name = db.Column(db.String(128), index=True)
    email = db.Column(db.String(128), index=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password = db.Column(db.LargeBinary, index=True)
    active_journey_index = db.Column(db.Integer)
    journeys = db.relationship('Journey', backref='author', lazy='dynamic')

    def __repr__(self):
        return "ID: {} | First Name: {} | Last Name: {} | Email: {} | Username: {} | Password: {}".format(self.id, self.first_name, self.last_name, self.email, self.username, self.password)


class Journey(db.Model):
    """ Journey data schema """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    journey_name = db.Column(db.String(128), index=True)
    start_location = db.Column(db.String(128), index=True)
    start_date = db.Column(db.DateTime, index=True)
    end_date = db.Column(db.DateTime, index=True)
    stops = db.relationship('Stop', backref='author', lazy='dynamic')

    def __repr__(self):
        return "ID: {} | User ID: {} | Start Date: {} | End Date: {}".format(self.id, self.user_id, self.start_date, self.end_date)


class Stop(db.Model):
    """ Stop data schema """
    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('journey.id'))
    stop_name = db.Column(db.String(128), index=True)
    arrival_date = db.Column(db.DateTime, index=True)
    departure_date = db.Column(db.DateTime, index=True)
    notes = db.Column(db.Text, index=True)
    itinerary = db.Column(db.LargeBinary)

    def __repr__(self):
        return "ID: {} | Stop: {}".format(self.id, self.stop_name)

class CacheInformation(db.Model):
    """ Cached Information data schema """
    id = db.Column(db.Integer, primary_key=True)
    place_name = db.Column(db.String(128), index=True)
    data_type = db.Column(db.String(128))
    cached_data = db.Column(db.LargeBinary)
    expiry = db.Column(db.DateTime)

    def __repr__(self):
        return f"ID: {self.id} | place: {self.place_name} | expiry: {self.expiry}"
