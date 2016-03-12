from django.conf.urls import include, url
from django.contrib import admin

from vtimecore import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/team/users$', views.team_users, name='team_users'),
    url(r'^api/team/tickets$', views.team_tickets, name='team_tickets'),
    url(r'^api/by_ticket$', views.by_ticket, name='by_ticket'),
    url(r'^api/by_user$', views.by_user, name='by_user'),
    url(r'^api/user_search/(?P<query>.*)/$',
        views.user_search, name='user_search'),
    url(r'^api/ticket_search/(?P<query>.*)/$',
        views.ticket_search, name='ticket_search'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^.*$', views.index, name='index')
]
