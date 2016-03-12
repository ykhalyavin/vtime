# coding: utf-8
from django import forms


class ByUserForm(forms.Form):
    obj_id = forms.CharField()
    start_date = forms.DateField(input_formats=['%Y-%m-%d'])
    end_date = forms.DateField(input_formats=['%Y-%m-%d'])


class ByTicketForm(forms.Form):
    obj_id = forms.IntegerField()
    start_date = forms.DateField(input_formats=['%Y-%m-%d'])
    end_date = forms.DateField(input_formats=['%Y-%m-%d'])


class ByTeamForm(forms.Form):
    team_slug = forms.CharField(required=False)
    start_date = forms.DateField(input_formats=['%Y-%m-%d'])
    end_date = forms.DateField(input_formats=['%Y-%m-%d'])


class SearchForm(forms.Form):
    query = forms.CharField(required=True)
    start_date = forms.DateField(input_formats=['%Y-%m-%d'])
    end_date = forms.DateField(input_formats=['%Y-%m-%d'])
