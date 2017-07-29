import requests

BASE_URL = 'https://api.instagram.com/v1/'
ACCESS_TOKEN = '7432461.6963913.2c9e62bb9e114def9f511c05a4d0e6c5'


def get_tags(tag):
    conn_string = BASE_URL + 'tags/search?q=' + tag + '&access_token=' + ACCESS_TOKEN
    print(conn_string)
    conn = requests.get(conn_string)
    return conn

def get_self():
    conn_string = BASE_URL + 'users/self/?access_token=' + ACCESS_TOKEN
    print(conn_string)
    conn = requests.get(conn_string)
    return conn

if __name__ == '__main__':
    # response = get_tags('doge')
    response = get_self()
    print(response.text)