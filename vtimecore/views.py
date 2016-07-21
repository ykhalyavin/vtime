import json
from collections import defaultdict
from datetime import datetime

from django.db.models import F, Q
from django.http import Http404, HttpResponse
from django.shortcuts import render

from vtimecore.forms import ByTeamForm, ByTicketForm, ByUserForm
from vtimecore.models import Record, Team, User, WorkHours


PRECISION = 2


class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)


def get_workhours(date):
    try:
        return WorkHours.objects.get(year=date.year, month=date.month).hours
    except WorkHours.DoesNotExist:
        return


def filter_dates(qs, start_date, end_date):
    if start_date and end_date:
        qs = qs.filter(Q(start_date__gte=start_date) |
                       Q(end_date__gte=start_date),
                       Q(start_date__lte=end_date) |
                       Q(end_date__lte=end_date))

    return qs


def maybe_fix_rec_dates(rec, start_date, end_date):
    if rec.start_date < start_date:
        rec.start_date = start_date
    if rec.end_date > end_date:
        rec.end_date = end_date


def data_for_single_object(attr, attr_id, start_date=None, end_date=None):
    assert attr in ['ticket', 'username']

    type_by_attr = {'ticket': 'username', 'username': 'ticket'}

    if start_date and end_date:
        start_date = datetime.combine(start_date, datetime.min.time())
        end_date = datetime.combine(end_date, datetime.max.time())

    qs = Record.objects.filter(**{attr: attr_id})
    qs = filter_dates(qs, start_date, end_date)

    hours_by_attr = defaultdict(int)
    total_hours_spent = 0

    for rec in qs.all():
        maybe_fix_rec_dates(rec, start_date, end_date)

        spent_hours = (rec.end_date - rec.start_date).total_seconds() / 3600
        total_hours_spent += spent_hours

        attr_name = type_by_attr[attr]
        hours_by_attr[getattr(rec, attr_name)] += spent_hours

    return {
        'spent_hours': round(total_hours_spent, PRECISION),
        'data': [{'id': k, 'spent_hours': round(v, PRECISION)}
                 for k, v in hours_by_attr.items()]
    }


def data_by_user(members, start_date, end_date):
    start_date = datetime.combine(start_date, datetime.min.time())
    end_date = datetime.combine(end_date, datetime.max.time())

    qs = Record.objects.filter(username__in=members)
    qs = filter_dates(qs, start_date, end_date)

    data_by_user = {}
    for u in members:
        data_by_user[u] = {
            'spent_hours': 0,
            'time_by_ticket_hours': defaultdict(int),
        }

    for rec in qs.all():
        maybe_fix_rec_dates(rec, start_date, end_date)

        x = data_by_user[rec.username]
        x['spent_hours'] += rec.spent_hours
        x['time_by_ticket_hours'][rec.ticket] += rec.spent_hours

    for x in data_by_user.values():
        x['spent_hours'] = round(x['spent_hours'], PRECISION)
        x['tickets'] = [{'id': t, 'spent_hours': round(v, PRECISION)}
                        for t, v in sorted(x['time_by_ticket_hours'].items(),
                                           key=lambda x: x[1], reverse=True)]

    return data_by_user


def data_by_ticket(members, start_date, end_date):
    start_date = datetime.combine(start_date, datetime.min.time())
    end_date = datetime.combine(end_date, datetime.max.time())

    qs = Record.objects.filter(username__in=members)
    qs = filter_dates(qs, start_date, end_date)

    data_by_ticket = {}
    for t in qs.values_list('ticket', flat=True):
        data_by_ticket[t] = {
            'spent_hours': 0,
            'time_by_user_hours': defaultdict(int)
        }

    for rec in qs.all():
        maybe_fix_rec_dates(rec, start_date, end_date)

        x = data_by_ticket[rec.ticket]
        x['spent_hours'] += rec.spent_hours
        x['time_by_user_hours'][rec.username] += rec.spent_hours

    for x in data_by_ticket.values():
        x['spent_hours'] = round(x['spent_hours'], PRECISION)
        x['users'] = [{'username': u, 'spent_hours': round(v, PRECISION)}
                      for u, v in sorted(x['time_by_user_hours'].items(),
                                         key=lambda x: x[1], reverse=True)]

    return data_by_ticket


def get_team_members(team_slug=None):
    team_qs = Team.objects

    team = None
    if team_slug:
        team = team_qs.filter(slug=team_slug).first()

    if not team:
        team = team_qs.first()

    if not team:
        raise Http404('There are no teams created yet')

    return team.slug, team.members.values_list('username', flat=True)


def index(request):
    c = {
        'teams': Team.objects.order_by('name').values_list('slug', 'name'),
        'max_date': Record.objects.latest(
            'start_date').end_date.strftime('%Y-%m-%d'),
        'min_date': Record.objects.earliest(
            'start_date').start_date.strftime('%Y-%m-%d')
    }

    return render(request, 'index.html', c)


def by_ticket(request):
    f = ByTicketForm(request.GET)

    if not f.is_valid():
        return HttpResponse(status=400)

    r = f.cleaned_data
    resp = data_for_single_object('ticket', r['obj_id'], r['start_date'],
                                  r['end_date'])
    resp['workhours'] = get_workhours(r['start_date'])

    return HttpResponse(json.dumps(resp, cls=SetEncoder),
                        content_type='application/json')


def by_user(request):
    f = ByUserForm(request.GET)

    if not f.is_valid():
        return HttpResponse(status=400)

    r = f.cleaned_data
    resp = data_for_single_object('username', r['obj_id'], r['start_date'],
                                  r['end_date'])
    resp['workhours'] = get_workhours(r['start_date'])

    return HttpResponse(json.dumps(resp, cls=SetEncoder),
                        content_type='application/json')


def team_users(request):
    f = ByTeamForm(request.GET)
    if not f.is_valid():
        return HttpResponse('Invalid arguments', status=400)

    r = f.cleaned_data
    t, members = get_team_members(r['team_slug'])

    users = []
    for k, v in data_by_user(members, r['start_date'], r['end_date']).items():
        v['username'] = k
        users.append(v)

    resp = {'data': users, 'workhours': get_workhours(r['start_date'])}
    return HttpResponse(json.dumps(resp, cls=SetEncoder),
                        content_type='application/json')


def team_tickets(request):
    f = ByTeamForm(request.GET)
    if not f.is_valid():
        return HttpResponse('Invalid arguments', status=400)

    r = f.cleaned_data
    t, members = get_team_members(r['team_slug'])

    tickets = []
    data = data_by_ticket(members, r['start_date'], r['end_date'])
    for k, v in sorted(data.items(),
                       key=lambda x: x[1]['spent_hours'],
                       reverse=True):
        v['ticket'] = k
        tickets.append(v)

    resp = {'data': tickets, 'workhours': get_workhours(r['start_date'])}
    return HttpResponse(json.dumps(resp, cls=SetEncoder),
                        content_type='application/json')


def user_search(request, query):
    if not query or len(query) < 2:
        values = []
    else:
        values = User.objects.filter(
            username__icontains=query
        ).annotate(
            name=F('username')
        ).values(
            'name'
        )

    return HttpResponse(json.dumps(list(values)),
                        content_type='application/json')


def ticket_search(request, query):
    if not query or len(query) < 3 or not query.isdigit():
        values = []
    else:
        t = Record.objects.filter(ticket=int(query)).first()
        values = t and [{'name': t.ticket}] or []

    return HttpResponse(json.dumps(list(values)),
                        content_type='application/json')
