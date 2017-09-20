"""
Defines all the endpoints of the backend.
SENG2021 s2 2017
"""

from server import app, api_handler, models, db
from flask import render_template, jsonify, request, current_app
from flask_cors import CORS, cross_origin
from flask_jwt import JWT, jwt_required, current_identity #, payload_handler
from datetime import datetime, timedelta
import pickle
import json

CORS(app)

def authenticate(username, password):
    """ Used to authenticate the user based on the database
        @param username: Username given
        @param password: Password given
        @return: the user that matches both username and password
            else return None
    """
    print('hello auth')
    user = models.User.query.filter_by(username=username).first()
    try:
        print(user)
        if user.password == password:
            return user
    except AttributeError:
        return None


def identity(payload):
    """ Provides an identity of the user """
    print(payload['identity'])
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
        query = models.CacheInformation.query.filter_by(place_name=search, data_type='flickr').first()
        if query:
            if query.expiry < datetime.utcnow():
                print('OLD')
                data = api_handler.search_flickr(search)
                # data = api_handler.search_places(place)
                cache = pickle.dumps(data)            
                query.cached_data = cache
                query.expiry = datetime.utcnow() + timedelta(days=7)
                db.session.commit()
            else:
                print('DODGED!' + str(query))
                data = pickle.loads(query.cached_data)
        else:
            # data = api_handler.search_places(place)
            data = api_handler.search_flickr(search)
            
            cache = pickle.dumps(data)
            created_cache = models.CacheInformation(place_name=search, data_type='flickr', 
                                                cached_data=cache, expiry=(datetime.utcnow() + timedelta(days=7)))
            db.session.add(created_cache)
            db.session.commit()

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
    stop = request.args.get('stop', 'toyko')
    query = models.CacheInformation.query.filter_by(place_name=stop, data_type='wiki').first()
    if query:
        if query.expiry < datetime.utcnow():
            print('OLD')
            # data = api_handler.search_places(stop)
            info = api_handler.wikipedia_call(stop)
            cache = pickle.dumps(info)            
            query.cached_data = cache
            query.expiry = datetime.utcnow() + timedelta(days=7)
            db.session.commit()
        else:
            print('DODGED!' + str(query))
            info = pickle.loads(query.cached_data)
    else:
        # data = api_handler.search_places(stop)
        info = api_handler.wikipedia_call(stop)
        
        cache = pickle.dumps(info)
        created_cache = models.CacheInformation(place_name=stop, data_type='wiki', 
                                            cached_data=cache, expiry=(datetime.utcnow() + timedelta(days=7)))
        db.session.add(created_cache)
        db.session.commit()

    # info = api_handler.wikipedia_call(stop)
    return jsonify({'info': info})


@app.route('/api/places/', methods=['GET'])
def google_places():
    place = request.args.get('place', 'toyko')
    query = models.CacheInformation.query.filter_by(place_name=place, data_type='attractions').first()
    if query:
        if query.expiry < datetime.utcnow():
            print('OLD')
            data = api_handler.search_places(place)
            cache = pickle.dumps(data)            
            query.cached_data = cache
            query.expiry = datetime.utcnow() + timedelta(days=7)
            db.session.commit()
        else:
            print('DODGED!' + str(query))
            data = pickle.loads(query.cached_data)
    else:
        data = api_handler.search_places(place)
        cache = pickle.dumps(data)
        created_cache = models.CacheInformation(place_name=place, data_type='attractions', 
                                            cached_data=cache, expiry=(datetime.utcnow() + timedelta(days=7)))
        db.session.add(created_cache)
        db.session.commit()
    return jsonify(data)


@app.route('/api/new_user', methods=['POST'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
def new_user():
    body = json.loads(request.data)
    #print(data)
    username = body['username']
    print(username)
    search_username = models.User.query.filter_by(username=username).first()
    if search_username:
        return jsonify({
            'message': username + " is taken."
        })
    
    password = body['password']
    email = body['email']
    first_name = body['firstName']
    last_name = body['lastName']
    gender = body['gender']
    created_user = models.User(username=username, password=password, email=email, first_name=first_name, last_name=last_name, gender=gender)
    db.session.add(created_user)
    db.session.commit()
    return jsonify({'message': 'success'})

@app.route('/api/new_place', methods=['POST'])
def new_place():
    print(request)
    name = request.form['name']
    search_name = models.Place.query.filter_by(place_name=name).first()
    if search_name:
        return jsonify({
            'message': name + " already exists."
        })

    rating = request.form['rating']
    created_place = models.Place(place_name=name, place_rating=rating)
    db.session.add(created_place)
    db.session.commit()

@app.route('/api/new_stop', methods=['POST'])
def new_stop():
    print(request)
    name = request.form['name']
    search_name = models.Stop.query.filter_by(stop_name=name).first()
    if search_name:
        return jsonify({
            'message': name + " already exists."
        })

    rating = request.form['rating']
    created_stop = models.Stop(stop_name=name, stop_rating=rating)
    db.session.add(created_stop)
    db.session.commit()

@app.route('/api/new_journey', methods=['POST'])
def new_journey():
    user_id = current_identity[0]
    created_journey = models.Journey(user_id=user_id,cost=0)
    db.session.add(created_journey)
    db.session.commit()

@app.route('/api/get_journey', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_journey():
    pass

@app.route('/api/get_all_journeys', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_all_journeys():
    # print('hello get journeys')
    id = current_identity[0]
    user = models.User.query.filter_by(id=id).first() # or models.User.query.get(1)
    # user = models.User.query.get(1)
    payload = []
    journeys = models.Journey.query.filter_by(user_id=user.id).all()
    for j in journeys:
        stops = models.Stop.query.filter_by(journey_id=j.id).all()
        print(stops)
        # j_item = {'journey_name': j.id, 'stops': [s.stop_name for s in stops]}
        s_payload = []
        for s in stops:
            location = call_cache(s.stop_name + ' city', 'coord') or (0,0)
            s_instance = {
                'name': s.stop_name,
                'arrival': s.arrival_date,
                'departure': s.departure_date,
                'lat': float(f'{location[0]:.4f}'),
                'lng': float(f'{location[1]:.4f}')
            }
            s_payload.append(s_instance)
        j_item = {'journey_name': j.journey_name, 'start': j.start_date, 'end': j.end_date, 'stops': s_payload}
        
        payload.append(j_item)
    # Think about how to handle a user without a journey
    print(payload)
    return jsonify({'active_journey': user.active_journey_index, 'journeys': payload})

@app.route('/api/switch_journey/', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def switch_journey():
    user = models.User.query.filter_by(current_identity[1])
    user.active_journey_index = int(request.args.get('active', '0'))
    db.session.commit()
    return jsonify({'active': user.active_journey_index})

@app.route('/api/get_account_details/', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_account_details():
    user = models.User.query.filter_by(id=current_identity[0]).first()
    return jsonify({'username': user.username, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name, 'gender': user.gender})

@app.route('/api/get_all_journey_names/', methods=['GET'])
@cross_origin(headers=['Content-Type','Authorization']) # Send Access-Control-Allow-Headers workaround
@jwt_required()
def get_all_journey_names():
    user = models.User.query.filter_by(id=current_identity[0]).first()
    journeys = models.Journey.query.filter_by(user_id=user.id).all()
    names = []
    for j in journeys:
        names.append(j.journey_name)
    return jsonify({'names': names})

#@app.route('/api/new_itinerary', methods=['POST'])
#def new_itinerary():
    #TO DO: get stop_id from stop in journey
    #print(request)
    #eventDay = request.form['eventDay']
    #created_itinerary = models.Itinerary(day_of_event=eventDay)
    #db.session.add(created_itinerary)
    #db.session.commit()

################ Old stuff ####################
@app.route('/')
@app.route('/index')
def index():
    """ Front page of the backend """
    return render_template('index.html')


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



@app.route('/api/test')
def test():
    location = call_cache('sydney', 'coord')
    # return '{0[0]}, {0[1]}'.format(location)
    return f'{location[0]:.4f}'


def call_cache(search, data_type):
    query = models.CacheInformation.query.filter_by(place_name=search, data_type=data_type).first()
    if query:
        if query.expiry < datetime.utcnow():
            # print('OLD')
            # data = api_handler.search_places(place)
            data = api_caller(search, data_type)        
            cache = pickle.dumps(data)            
            query.cached_data = cache
            query.expiry = datetime.utcnow() + timedelta(days=7)
            db.session.commit()
        else:
            # print('DODGED!' + str(query))
            data = pickle.loads(query.cached_data)
    else:
        data = api_caller(search, data_type)
            
        cache = pickle.dumps(data)
        created_cache = models.CacheInformation(place_name=search, data_type=data_type, 
                                            cached_data=cache, expiry=(datetime.utcnow() + timedelta(days=7)))
        db.session.add(created_cache)
        db.session.commit()
    print(data)
    return data

def api_caller(search, data_type):
    if data_type ==  'attractions':
        data = api_handler.search_places(search)
    elif data_type == 'flickr':
        data = api_handler.search_flickr(search)
    elif data_type == 'wiki':
        data = api_handler.wikipedia_call(search)
    elif data_type == 'coord':
        data = api_handler.wiki_location(search)
    return data