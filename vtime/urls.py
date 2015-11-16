from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns(
    '',
    url(r'^$', 'vtimecore.views.index', name='index'),
    url(r'^by_team/$', 'vtimecore.views.index', name='by_user'),
    url(r'^by_ticket/$', 'vtimecore.views.by_ticket', name='by_ticket'),
    url(r'^admin/', include(admin.site.urls)),
)
