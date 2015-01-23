FROM ubuntu
MAINTAINER James Tranovich
RUN echo "deb http://archive.ubuntu.com/ubuntu/ $(lsb_release -sc) main universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y git python3.4 python3.4-dev python3-pip
RUN git clone https://github.com/cantsin/led-movie-visualization /lmv
RUN pip3 install -r /lmv/requirements.txt
EXPOSE 80
WORKDIR /lmv
CMD python3.4 -c "from models import db; db.create_all()"
CMD python3.4 -c "from models import User; User('bright@leds.com', 'CHANGEME').save()"
CMD python3.4 app.py 80
