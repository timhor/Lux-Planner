from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import flickrapi

app = Flask(__name__)
app.config.from_object('config')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-u45bhj35b54b45j456'
db = SQLAlchemy(app)
flickr = flickrapi.FlickrAPI('2da548fb2c2e6ed3a55b22e84c6cc550', '800f20038bd86d11', format='parsed-json')

from server import views, models