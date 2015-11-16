# coding: utf-8
from django import forms


class ByTicketForm(forms.Form):
    ticket = forms.IntegerField()
    start_date = forms.DateField(input_formats=['%Y-%m-%d'])
    end_date = forms.DateField(input_formats=['%Y-%m-%d'])


class ByTeamForm(forms.Form):
    team_id = forms.IntegerField(required=False)
    start_date = forms.DateField(input_formats=['%Y-%m-%d'])
    end_date = forms.DateField(input_formats=['%Y-%m-%d'])
