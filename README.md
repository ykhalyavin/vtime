# Install and Run
pip install -r requirements.txt

export PYTHONPATH=/home/user/git/vtime
export DJANGO_SETTINGS_MODULE=vtime.settings

django-admin migrate
django-admin createsuperuser
django-admin import_timesheets

django-admin runserver 0.0.0.0:8001

# Create a team
http://localhost:8001/admin/vtimecore/team/add/

# Index request -- has optional parameter "team_id" (default: 1)
http://localhost:8001/?start_date=2015-11-1&end_date=2015-11-10

# By ticket request
http://localhost:8001/by_ticket/?start_date=2015-11-1&end_date=2015-11-10&ticket=298875


# TODO
1. Make start/end date optional in by ticket request, to return all available
   data per the ticket
2. Move to DRF from forms
