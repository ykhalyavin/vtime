from django.contrib import admin
from django.contrib.admin import register

from vtimecore.models import Team, WorkHours


@register(WorkHours)
class WorkHoursAdmin(admin.ModelAdmin):
    list_display = ('year', 'month', 'hours')


@register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_members')
    filter_vertical = ('members', )
    prepopulated_fields = {'slug': ('name', )}

    def get_members(self, obj):
        return ' | '.join(obj.members.values_list('username', flat=True))
