from server import flickr
import wikipedia
import requests

places_key = "AIzaSyDexUm1K0gdiN6UTsOqSpZv-C09D_N6l-w"

def search_flickr(request):
    """ Calls on the Flickr photo search API
        @param request: Search text
        @return: response body as dict
    """
    return flickr.photos.search(text=request, sort='relevance')


def wikipedia_call(request):
    return wikipedia.summary(wikipedia.search(request)[0])

def search_places(request):
    response = requests.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + request + "&key=" + places_key)
    # https://maps.googleapis.com/maps/api/place/nearbysearch/output?parameters
    formatted = response.json()
    lat = formatted['results'][0]['geometry']['location']['lat']
    lng = formatted['results'][0]['geometry']['location']['lng']
    keyword = 'attraction'
    response = requests.get(f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?key={places_key}&location={lat},{lng}&radius=5000&keyword={keyword}")
    
    return response.json()
