# SENG2021-Project

## Installing Python
#### Windows:
1. Download from the [Official Python Page](https://www.python.org/downloads/)
2. Ensure you have Python you tick _Add Python 3.x to your PATH_

#### MacOS:
1. Ensure you have Homebrew installed
2. Just type
```bash
brew install python3
```

#### Linux:
1. Well figure it out yourself since you're a geek anyways. Probably
```bash
sudo apt-get install python3
```
or something

## Installing Python Virtual Environment (and Wrapper) **OPTIONAL**
Reason: Working in virtual environments helps you manage dependencies. Not so important here if you're not gonna be a _snek_ programmer like me, but extremely important once you are going to use it in the future. Dependency management keeps things clean, so porting to someone else's computer isn't a pain, just simply have a _requirements.txt_ to handle it.
For more info see [Official venvwrapper page](http://virtualenvwrapper.readthedocs.io/en/latest/install.html)
1. Enter the following lines on your terminal:
```bash
pip install virtualenv
pip install virtualenvwrapper
```
Note: Might need _sudo_ if you're Linux.

After installing _venvwrapper_, you can create your environment using:
```bash
mkvirtualenv flask-pack
```

To get out out of it, simply type:
```bash 
deactivate
```
To get back into that virtual environment:
```bash
workon flask-pack
```
Installing this is a pain on multiple platforms, so hit Michael up if you need a hand. (Vintony was able to get it working on Windows)

## Installing Flask
If you do have _venvwrapper_ then _workon_ it first.
1. Time to download stuff. (This list of things to download will increase over time once we add in more packages. For now, it is barebones)
```bash
pip install flask
```

## Running the Web App Server
1. Ensure your terminal is in the current base folder of the git repo (where _run.py_ is)
```bash
python3 run.py
```
Note: If you are a Windows user, you might need to use _python_ or _py_ instead.
2. On your web browser go to either to see your wonderful website:
```
localhost:5000
http://127.0.0.1:5000/
```