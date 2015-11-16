from django.db import models


class Record(models.Model):
    username = models.CharField('Username', max_length=25)
    start_date = models.DateTimeField('End date')
    end_date = models.DateTimeField('End date')
    ticket = models.PositiveIntegerField('Ticket No.')
    comment = models.TextField('Comment')

    class Meta:
        index_together = (('start_date', 'username'), ('ticket', ))


class User(models.Model):
    username = models.CharField('Username', max_length=25)
    file_modified = models.DateTimeField('File mtime')

    def __str__(self):
        return self.username


class Team(models.Model):
    name = models.CharField('Team name', max_length=25)
    members = models.ManyToManyField(User)

    def __str__(self):
        return self.name
