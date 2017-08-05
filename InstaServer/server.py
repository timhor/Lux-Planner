from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def base():
    return render_template('index.html')

@app.route('/<auth>')
def auth_route(auth):
    if auth != 'favicon.ico':
        print(auth)
    return render_template('user.html', name = auth)

if __name__ == '__main__':
    app.run(debug=True)