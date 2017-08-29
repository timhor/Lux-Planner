from server import flickr

def search_flickr(request):
    return flickr.photos.search(text=request, sort='relevance')

