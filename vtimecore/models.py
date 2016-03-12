from django.db import models


class Record(models.Model):
    username = models.CharField('Username', max_length=25)
    start_date = models.DateTimeField('End date')
    end_date = models.DateTimeField('End date')
    ticket = models.PositiveIntegerField('Ticket No.')
    comment = models.TextField('Comment')

    class Meta:
        index_together = (('start_date', 'username'), ('ticket', ))
        unique_together = ('username', 'start_date', 'end_date')

    @property
    def spent_hours(self):
        return (self.end_date - self.start_date).total_seconds() / 3600


class User(models.Model):
    username = models.CharField('Username', max_length=25, db_index=True)
    file_modified = models.DateTimeField('File mtime')

    class Meta:
        ordering = ('username', )

    def __str__(self):
        return self.username


class Team(models.Model):
    name = models.CharField('Team name', max_length=25, unique=True)
    members = models.ManyToManyField(User)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class WorkHours(models.Model):
    year = models.PositiveSmallIntegerField()
    month = models.PositiveSmallIntegerField()
    hours = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ('year', 'month')
