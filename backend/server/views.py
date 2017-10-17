"""
Defines all the endpoints of the backend.
SENG2021 s2 2017
"""

from server import app, api_handler, models, db
from flask import render_template, jsonify, request, current_app
from flask_cors import CORS, cross_origin
from flask_jwt import JWT, jwt_required, current_identity
from datetime import datetime, timedelta
from Crypto.Cipher import Salsa20
import pickle
import json
import re
import base64

CORS(app)

def authenticate(username, password):
    """ Used to authenticate the user based on the database
        @param username: Username given
        @param password: Password given
        @return: the user that matches both username and password
            else return None
    """
    user = models.User.query.filter_by(username=username).first()
    checkPassword = base64.b64decode(user.password).decode()
    print(checkPassword)
    print(password)
    if checkPassword == password:
        return user


def identity(payload):
    """ Provides an identity of the user """
    return payload['identity']  # identity payload => current_identity (global var)


jwt = JWT(app, authenticate, identity)

@jwt.jwt_payload_handler
def make_payload(identity):
    """ Creates a payload to return to user after authenticating
    """
    iat = datetime.utcnow()
    exp = iat + current_app.config.get('JWT_EXPIRATION_DELTA') + timedelta(days=7)
    nbf = iat + current_app.config.get('JWT_NOT_BEFORE_DELTA')
    # Create the identity payload here
    id_payload = [getattr(identity, 'id'), getattr(identity, 'username')]

    return {'exp': exp, 'iat': iat, 'nbf': nbf, 'identity': id_payload}



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
        data = call_cache(search, 'flickr')

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
            url = "https://farm{}.staticflickr.com/{}/{}_{}.jpg".format(
                farm_id, server_id, photo_id, secret_id)
            urls.append(url)
        return jsonify({"images" : urls})
    except:
        return jsonify({"images" : 'None'})


@app.route('/api/stop_information/', methods=['GET'])
def wikipedia_search():
    """ Gets the stop information from Wikipedia """
    stop = request.args.get('stop', 'toyko')
    info = call_cache(stop, 'wiki')
    print(info)
    return jsonify({'info': info})


@app.route('/api/places/', methods=['GET'])
def google_places():
    """ Gets nearby attractions from Google Places """
    place = request.args.get('place', 'toyko')
    data = call_cache(place, 'attractions')
    return jsonify(data)


@app.route('/api/new_user', methods=['POST'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
def new_user():
    """ Creates a new user """
    body = json.loads(request.data)
    username = body['username']
    search_username = models.User.query.filter_by(username=username).first()
    if search_username:
        return jsonify({
            'message': username + " is taken."
        })

    password_bytes = base64.b64encode(body['password'].encode())
    email = body['email']
    first_name = body['firstName']
    last_name = body['lastName']
    created_user = models.User(username=username, password=password_bytes, email=email,
        first_name=first_name, last_name=last_name, active_journey_index=0)
    db.session.add(created_user)
    db.session.commit()
    return jsonify({'message': 'success'})


@app.route('/api/new_journey', methods=['POST'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def new_journey():
    """ Creates a new Journey and its associated Stops """
    user_id = current_identity[0]
    body = json.loads(request.data)
    if body['isModifying'] == -1:
        j = models.Journey(
                user_id=user_id,
                journey_name=body['journeyName'],
                start_location=body['initialLocation'],
                start_date = convert_time(body['initialDeparture']),
                end_date = convert_time(body['initialArrival'])
            )
        db.session.add(j)
    else:
        user = models.User.query.filter_by(id=user_id).first()
        journeys = models.Journey.query.filter_by(user_id=user.id).order_by(models.Journey.id).all()
        j = journeys[body['isModifying']]
        j.journey_name = body['journeyName']
        j.start_location = body['initialLocation']
        j.start_date = convert_time(body['initialDeparture'])
        j.end_date = convert_time(body['initialArrival'])
        stops = models.Stop.query.filter_by(journey_id=j.id).delete()

    # Commit the empty journey
    db.session.commit()

    # Add the stops
    for s in body['destinations']:
        s_start = convert_time(s['arrival'])
        s_end = convert_time(s['departure'])
        stop = models.Stop(
            journey_id=j.id,
            stop_name=s['location'],
            arrival_date=s_start,
            departure_date=s_end
        )
        db.session.add(stop)
    db.session.commit()
    return jsonify({'message': 'OK'})


@app.route('/api/get_all_journeys', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_all_journeys():
    """ Gets all Journeys associated with the User """
    id = current_identity[0]
    user = models.User.query.filter_by(id=id).first() # or models.User.query.get(1)
    payload = []
    journeys = models.Journey.query.filter_by(user_id=user.id).order_by(models.Journey.id).all()
    for j in journeys:
        stops = models.Stop.query.filter_by(journey_id=j.id).order_by(models.Stop.id).all()
        s_payload = []
        for s in stops:
            location = call_cache(s.stop_name, 'coord')
            s_instance = {
                'name': s.stop_name,
                'arrival': s.arrival_date,
                'departure': s.departure_date,
                'lat': location['lat'],
                'lng': location['lon'],
                'notes': s.notes
            }
            s_payload.append(s_instance)
        home_coord = call_cache(j.start_location, 'coord')
        j_item = {
            'journey_name': j.journey_name,
            'start_location': j.start_location,
            'start': j.start_date,
            'end': j.end_date,
            'stops': s_payload,
            'lat': home_coord['lat'],
            'lng': home_coord['lon']
            }

        payload.append(j_item)
    return jsonify({'active_journey': user.active_journey_index, 'journeys': payload})


@app.route('/api/get_journeys_length', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_journeys_length():
    """ Gets number of Journeys made by the User """
    id = current_identity[0]
    user = models.User.query.filter_by(id=id).first()
    payload = []
    journeys = models.Journey.query.filter_by(user_id=user.id).order_by(models.Journey.id).all()
    length = len(journeys)
    return jsonify({'length': length})


@app.route('/api/switch_journey/', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def switch_journey():
    """ Switches the active Journey of the User """
    user = models.User.query.filter_by(current_identity[1])
    user.active_journey_index = int(request.args.get('active', '0'))
    db.session.commit()
    return jsonify({'active': user.active_journey_index})


@app.route('/api/update_notes', methods=['POST'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def update_notes():
    """ Updates the notes of a single Stop of a User """
    user_id = current_identity[0]
    body = json.loads(request.data)
    journeys = models.Journey.query.filter_by(user_id=user_id).all()
    j = journeys[body['jIndex']]
    stops = models.Stop.query.filter_by(journey_id=j.id).order_by(models.Stop.id).all()
    stops[body['sIndex']].notes = body['notes']
    db.session.commit()
    return jsonify({'message': 'success'})


@app.route('/api/delete_journey', methods=['POST'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def delete_journey():
    """ Deletes a Journey and its associated Stops """
    body = json.loads(request.data)
    user = models.User.query.filter_by(id=current_identity[0]).first()
    journeys = models.Journey.query.filter_by(user_id=user.id).all()
    j = journeys[body['delete']]
    stops = models.Stop.query.filter_by(journey_id=j.id).delete()
    db.session.delete(j)
    db.session.commit()
    return jsonify({'message': 'success'})


@app.route('/api/get_account_details/', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_account_details():
    """ Gets the user account details -- excluding password """
    user = models.User.query.filter_by(id=current_identity[0]).first()
    return jsonify({'username': user.username, 'email': user.email, 'first_name': user.first_name,
                    'last_name': user.last_name})


@app.route('/api/get_all_journey_names/', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_all_journey_names():
    """ Gets the names of all Journeys for the User """
    user = models.User.query.filter_by(id=current_identity[0]).first()
    journeys = models.Journey.query.filter_by(user_id=user.id).order_by(models.Journey.id).all()
    names = []
    for j in journeys:
        names.append(j.journey_name)
    return jsonify({'names': names})


@app.route('/api/change_user_details/', methods=['POST'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def change_user_details():
    """ Changes User details that are submitted """
    user = models.User.query.filter_by(id=current_identity[0]).first()
    body = json.loads(request.data)
    for key in body:
        if key == 'password':
            user.password = body['password'].encode()
        if key == 'email':
            user.email = body['email']
        if key == 'firstName':
            user.first_name = body['firstName']
        if key == 'lastName':
            user.last_name = body['lastName']
    db.session.commit()
    return jsonify({'message': 'success'})


@app.route('/api/get_itinerary/', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_itinerary():
    """ Gets the itinerary of a single Stop """
    journey_index = int(request.args.get('journey'))
    stop_index = int(request.args.get('stop'))
    user = models.User.query.filter_by(id=current_identity[0]).first()
    journeys = models.Journey.query.filter_by(user_id=user.id).order_by(models.Journey.id).all()
    j = journeys[journey_index]
    stops = models.Stop.query.filter_by(journey_id=j.id).order_by(models.Stop.id).all()
    if stops[stop_index].itinerary is None:
        return jsonify([])
    return jsonify(pickle.loads(stops[stop_index].itinerary))


@app.route('/api/update_itinerary', methods=['POST'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def update_itinerary():
    """ Overwrites the currently stored Itinerary data """
    body = json.loads(request.data)
    print(body)
    journey_index = int(body['journey'])
    stop_index = int(body['stop'])
    user = models.User.query.filter_by(id=current_identity[0]).first()
    journeys = models.Journey.query.filter_by(user_id=user.id).order_by(models.Journey.id).all()
    j = journeys[journey_index]
    stops = models.Stop.query.filter_by(journey_id=j.id).order_by(models.Stop.id).all()
    stops[stop_index].itinerary = pickle.dumps(body['events'])
    db.session.commit()
    return jsonify({'message': 'success'})


@app.route('/')
@app.route('/index')
def index():
    """ Front page of the backend """
    return render_template('index.html')


##### Helper functions ####
def call_cache(search, data_type):
    """ Calls the cache for stored information to minimise latency
        Stores data for at most 7 days
    """
    query = models.CacheInformation.query.filter_by(place_name=search, data_type=data_type).first()
    if query:
        if query.expiry < datetime.utcnow():
            data = api_caller(search, data_type)
            cache = pickle.dumps(data)
            query.cached_data = cache
            query.expiry = datetime.utcnow() + timedelta(days=7)
            db.session.commit()
        else:
            data = pickle.loads(query.cached_data)
    else:
        data = api_caller(search, data_type)
        cache = pickle.dumps(data)
        created_cache = models.CacheInformation(
            place_name=search,
            data_type=data_type,
            cached_data=cache,
            expiry=(datetime.utcnow() + timedelta(days=7))
            )
        db.session.add(created_cache)
        db.session.commit()
    return data


def api_caller(search, data_type):
    """ Calls external API for the latest information """
    if data_type == 'attractions':
        data = api_handler.search_places(search)
    elif data_type == 'flickr':
        data = api_handler.search_flickr(search)
    elif data_type == 'wiki':
        data = api_handler.get_wiki_summary(search)
    elif data_type == 'coord':
        data = api_handler.search_places_coords(search)
    return data


def convert_time(time_string):
    """ Converts TypeScript stringified string to Python DateTime """
    # 2017-09-26T10:05:56.000Z
    try:
        python_time = datetime.strptime(time_string, '%Y-%m-%dT%H:%M:%S.000Z')
    except:
        python_time = datetime.utcnow()
    return python_time
