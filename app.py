#!/usr/bin/env python3.4
# pylint: disable=C0103,C0111,W0142

# ugh. work around an internal bug with flask and python3.4
import pkgutil
old_loader = pkgutil.get_loader
def override_loader(*args, **kwargs):
    try:
        return old_loader(*args, **kwargs)
    except AttributeError:
        return None
pkgutil.get_loader = override_loader

from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask.ext.login import LoginManager, login_required, login_user, \
    logout_user, current_user
from werkzeug import secure_filename
from util import slugify, naturaltime, get_gravatar, \
    url_for_redirect_back, get_redirect_target, downsample
from models import User

import os
import config

UPLOAD_FOLDER  = 'uploads'
CONVERT_FOLDER = 'static/movies'
LED_WIDTH=30   # number of LEDs per panel width
LED_HEIGHT=18  # number of LEDs per panel height
PANELS=5       # number of panels

app = Flask('led-movie-visualization')
app.jinja_env.filters['slugify'] = slugify
app.jinja_env.filters['naturaltime'] = naturaltime
app.secret_key = config.secret_key
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html', error=error), 404

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    next_target = get_redirect_target()
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(login=email).scalar()
        if user and user.check_password(password):
            login_user(user)
            url = url_for('dashboard')
            return redirect(url)
        else:
            error = 'Email and password do not match.'
    return render_template('index.html',
                           next=next_target,
                           error=error)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    movies = [x for x in os.listdir(CONVERT_FOLDER) if x.startswith('led')]
    return render_template('dashboard.html',
                           movies=movies,
                           led_width=LED_WIDTH,
                           led_height=LED_HEIGHT,
                           panels=PANELS)

@app.route('/upload', methods=['POST'])
@login_required
def upload():
    movie = request.files['movie']
    filename = secure_filename(movie.filename)
    path = os.path.join(UPLOAD_FOLDER, filename)
    movie.save(path)
    success, msg = downsample(UPLOAD_FOLDER,
                              CONVERT_FOLDER,
                              filename,
                              LED_WIDTH*PANELS,
                              LED_HEIGHT*PANELS)
    if not success:
        return jsonify(error=msg)
    return redirect(url_for('dashboard'))

@app.route('/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)

if __name__ == '__main__':
    import sys
    app.debug = True
    port = 5000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    app.run(port=port)
