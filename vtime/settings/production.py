import os

from vtime.settings.base import *  # NOQA

DEBUG = False
ALLOWED_HOSTS = ['*']

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_JS_FILTERS = []  # disable compression

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'vtime',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '',
    }
}

SHEETS_DIR = os.environ.get('VTIME_SHEETS_DIR', SHEETS_DIR)  # NOQA
