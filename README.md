Timesheet analytics tool
=======

This tool allows to analyze time spent by a team/user or how much time a ticket took.

User view:
![user](https://cloud.githubusercontent.com/assets/477081/13722970/8e139c6c-e867-11e5-9da8-c7a5065d0c59.png)

Ticket view:
![ticket](https://cloud.githubusercontent.com/assets/477081/13723008/c3d30e5e-e868-11e5-9f34-9e270ca0f9f3.png)

Team users view:
![team-users] (https://cloud.githubusercontent.com/assets/477081/13722969/8dfab72e-e867-11e5-8efc-563ef8708511.png)

Team tickets view:
![team-tickets](https://cloud.githubusercontent.com/assets/477081/13723009/c3d58b20-e868-11e5-99ef-49e32a096792.png)

Install and Run
=======
pip install -r requirements.txt

export PYTHONPATH=/home/user/git/vtime
export DJANGO_SETTINGS_MODULE=vtime.settings

django-admin migrate
django-admin createsuperuser
django-admin import_timesheets

django-admin runserver 0.0.0.0:8001

Create a team
=======
http://localhost:8001/admin/vtimecore/team/add/
