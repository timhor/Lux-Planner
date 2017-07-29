from flask import Flask

app = Flask(__name__)


@app.route('/')
def base():
    return "Hello world"

@app.route('/<auth>')
def auth_route(auth):
    if auth != 'favicon.ico':
        print(auth)
    return "Bye world"

if __name__ == '__main__':
    app.run(debug=True)