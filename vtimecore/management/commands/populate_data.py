# coding: utf-8
import random
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand

from vtimecore.models import Record, User


class Command(BaseCommand):
    def handle(self, *args, **options):
        users = ['Kate', 'Ilya', 'Denis', 'Dmitry', 'Grigory', 'Stas']
        tickets = random.sample(range(2222, 33333), 15)

        now = datetime.now()
        month_ago = now - timedelta(days=31)

        records = []

        for u in users:
            User.objects.create(
                username=u,
                file_modified=datetime.now()
            )

            dt = month_ago
            while dt < now:
                hours = random.randint(6, 10)  # Hour worked in the day
                start_hour = random.randint(8, 12)  # Hour worked in the day
                for x in range(hours):
                    rec = Record(
                        username=u,
                        start_date=dt.replace(hour=start_hour),
                        end_date=dt.replace(hour=start_hour + x + 1),
                        ticket=random.choice(tickets),
                        comment='comment'
                    )

                    records.append(rec)

                dt = dt + timedelta(days=1)

        Record.objects.bulk_create(records)
