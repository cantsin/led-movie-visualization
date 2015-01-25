
# LED Movie Visualization

A simple Flask application to play back videos at a much lower resolution that simulates a LED screen. Applicable for LED screen art projects.

## Installation

### The Short Way

A `Dockerfile` is provided. Simply run `docker build .` to build an image. The web port is exposed by `80` by default in the running container.

### The Long Way

A python 3.4
[http://docs.python-guide.org/en/latest/dev/virtualenvs/](virtualenv)
is highly recommended. Install and set up a virtualenv and make sure
you are 'inside' the virtualenv.

TL;DR:

    virtualenv -p /usr/bin/python3.4 venv
    source venv/bin/activate

The list of python packages we use is in `requirements.txt`. In the
virtualenv, run:

    pip install -r requirements.txt

That will install all of the requisite packages in the virtualenv.
Create the sqlite database by:

    python -c "from models import db; db.create_all()"

To run the application, simply invoking `./app.py` is all that is
needed.

You may want to set up an user beforehand as there is no provision for
creating an user. Adding a new user is also simple:

    python -c "from models import User; User('email@somewhere.org', 'password').save()"
