#!/usr/bin/env bash
source ./venv/bin/activate
export FLASK_APP=fake.py
flask run --host=0.0.0.0

#netstat -tupln | grep ':5000'

##!/usr/bin/env bash
#export LC_ALL=C.UTF-8
#export LANG=C.UTF-8
#source ./venv/bin/activate
#export FLASK_APP=fake.py
#flask run --host=0.0.0.0