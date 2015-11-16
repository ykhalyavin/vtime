# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('username', models.CharField(verbose_name='Username', max_length=25)),
                ('start_date', models.DateTimeField(verbose_name='End date')),
                ('end_date', models.DateTimeField(verbose_name='End date')),
                ('ticket', models.PositiveIntegerField(verbose_name='Ticket No.')),
                ('comment', models.TextField(verbose_name='Comment')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.CharField(verbose_name='Team name', max_length=25)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('username', models.CharField(verbose_name='Username', max_length=25)),
                ('file_modified', models.DateTimeField(verbose_name='File mtime')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='team',
            name='members',
            field=models.ManyToManyField(to='vtimecore.User'),
            preserve_default=True,
        ),
        migrations.AlterIndexTogether(
            name='record',
            index_together=set([('ticket',), ('start_date', 'username')]),
        ),
    ]
