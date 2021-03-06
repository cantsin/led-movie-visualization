FROM ubuntu
MAINTAINER James Tranovich
RUN echo "deb http://archive.ubuntu.com/ubuntu/ $(lsb_release -sc) main universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y git python3.4 python3.4-dev python3-pip libav-tools
RUN git clone https://github.com/cantsin/led-movie-visualization /lmv
RUN pip3 install -r /lmv/requirements.txt
EXPOSE 80
WORKDIR /lmv
# create the database and create an initial user
CMD python3.4 -c "from app import initialize; initialize('bright@leds.com', 'CHANGEME')" && \
    python3.4 app.py 80
