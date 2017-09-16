from server import flickr
import wikipedia

def search_flickr(request):
    """ Calls on the Flickr photo search API
        @param request: Search text
        @return: response body as dict
    """
    return flickr.photos.search(text=request, sort='relevance')


def wikipedia_call(request):
    return wikipedia.summary(wikipedia.search(request)[0])