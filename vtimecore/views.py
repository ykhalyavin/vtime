from collections import defaultdict
from itertools import groupby
from operator import itemgetter
import json

from django.http import HttpResponse

import humanfriendly

from vtimecore.models import Record, Team
from vtimecore.forms import ByTeamForm, ByTicketForm


class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)


def data_by_ticket(ticket, start_date=None, end_date=None):
    ret = {'time_spent_sec': 0, 'users': set()}

    qs = Record.objects.filter(ticket=ticket)
    if start_date and end_date:
        qs = qs.filter(start_date__gte=start_date, end_date__lte=end_date)

    for rec in qs.all():
        spent_sec = (rec.end_date - rec.start_date).total_seconds()

        ret['time_spent_sec'] += spent_sec
        ret['users'].add(rec.username)

    ret['time_spent'] = humanfriendly.format_timespan(ret['time_spent_sec'])
    ret['users'] = sorted(ret['users'])

    return ret


def data_by_user(members, start_date, end_date):
    qs = Record.objects.filter(username__in=members,
                               start_date__gte=start_date,
                               end_date__lte=end_date)

    data_by_user = {}
    for u in members:
        data_by_user[u] = {
            'tickets': set(),
            'time_spent_sec': 0,
            'time_by_ticket': defaultdict(int),
            'comments_by_ticket': defaultdict(list)
        }

    for rec in qs.all():
        spent_sec = (rec.end_date - rec.start_date).total_seconds()

        x = data_by_user[rec.username]
        x['tickets'].add(rec.ticket)
        x['time_spent_sec'] += spent_sec
        x['time_by_ticket'][rec.ticket] += spent_sec
        x['comments_by_ticket'][rec.ticket].append(rec.comment)

    for x in data_by_user.values():
        x['time_spent_sec'] += spent_sec
        x['time_spent'] = (
                humanfriendly.format_timespan(x['time_spent_sec']))

    return data_by_user


def by_ticket(request):
    f = ByTicketForm(request.GET)

    if not f.is_valid():
        return HttpResponse(status=400)

    r = f.cleaned_data
    resp = data_by_ticket(r['ticket'], r['start_date'], r['end_date'])

    return HttpResponse(json.dumps(resp, cls=SetEncoder),
                        content_type='application/json')


def index(request):
    f = ByTeamForm(request.GET)

    if not f.is_valid():
        return HttpResponse(status=400)

    r = f.cleaned_data
    team_id = r['team_id'] or 1

    teams = Team.objects.values_list('id', 'name', 'members__username')
    teams = sorted(teams, key=itemgetter(0, 1))

    requested_members = []
    t = []
    for (_id, name), data in groupby(teams, itemgetter(0, 1)):
        members = [x[-1] for x in data]

        active = False
        if _id == team_id:
            requested_members = members
            active = True

        t.append({'id': _id, 'name': name, 'members': members,
                  'active': active})

    if not requested_members:
        return HttpResponse(status=404)

    resp = {
        'teams': t,
        'data_by_user': data_by_user(requested_members,
                                     r['start_date'], r['end_date'])
    }

    return HttpResponse(json.dumps(resp, cls=SetEncoder),
                        content_type='application/json')
