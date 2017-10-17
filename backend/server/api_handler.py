from server import flickr
import requests
import re

places_key = "AIzaSyAWhdBjPKjj_DNstBfp3i65VTtCeEzucyc"

def search_flickr(request):
    """ Calls on the Flickr photo search API
        @param request: Search text
        @return: response body as dict
    """
    return flickr.photos.search(text=request, sort='relevance')


def search_places(request):
    response = requests.get(f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={request}&key={places_key}")
    # https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters
    formatted = response.json()
    lat = formatted['results'][0]['geometry']['location']['lat']
    lng = formatted['results'][0]['geometry']['location']['lng']
    keyword = 'attraction'
    response = requests.get(f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?key={places_key}&location={lat},{lng}&radius=5000&keyword={keyword}")
    data = response.json()['results']
    attractions = []
    for place in data[:12]:
        name = place.get('name', 'Could not find attraction')
        address = place.get('vicinity', 'Address is unknown')
        ratings = place.get('rating', 'Unrated')
        try:
            photo_key = place['photos'][0]['photo_reference']
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference={photo_key}&key={places_key}"
        except KeyError:
            photo_url = "https://dummyimage.com/250x250/000000/baffef&text=No+Image+Available"

        item = {
            'name': name,
            'address': address,
            'ratings': ratings,
            'photo': photo_url
        }
        attractions.append(item)

    return attractions


def search_places_coords(request):
    response = requests.get(f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={request}&key={places_key}")
    # https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters
    formatted = response.json()
    lat = formatted['results'][0]['geometry']['location']['lat']
    lon = formatted['results'][0]['geometry']['location']['lng']
    coords = {
        'lat': lat,
        'lon': lon
    }
    return coords


def get_wiki_summary(request):
    while 1:
        # data = requests.get(f'https://simple.wikipedia.org/w/api.php?action=query&titles={request}&prop=extracts&exintro=1&format=json&redirects').json()
        data = requests.get(f'https://en.wikipedia.org/w/api.php?action=query&titles={request}&prop=extracts&exintro=&exsentences=10&format=json&redirects').json()

        if '-1' in data['query']['pages']:
            if ',' not in request:
                return 'No information found.'
            request = re.sub(r',[^,]*?$', '', request)
        else:
            for item in data['query']['pages']:
                info = data['query']['pages'][item]['extract']
                info = re.sub(r' \(<span>.*?</span>\)', '', info)
                info = re.sub(r' <span>\(.*?\)</span>', '', info)
                info = re.sub(r' \(.*?(lang|title).*?</span>\)', '', info)
                return info
            return data
