from django.contrib import admin
from django.contrib.admin import register
from django.forms import SelectMultiple
from django.db import models

from vtimecore.models import Team


@register(Team)
class TeamAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.ManyToManyField: {
            'widget': SelectMultiple(attrs={'size': '40'})
        }
    }
