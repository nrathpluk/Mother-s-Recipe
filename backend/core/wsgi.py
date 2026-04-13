"""
WSGI config for Mother's Recipe project.
Gunicorn uses this entry point on Render.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
application = get_wsgi_application()
