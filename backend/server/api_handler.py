from server import flickr

def search_flickr(request):
    """ Calls on the Flickr photo search API
        @param request: Search text
        @return: response body as dict
    """
    return flickr.photos.search(text=request, sort='relevance')
