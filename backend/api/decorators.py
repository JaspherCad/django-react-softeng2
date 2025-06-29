# decorators.py

from functools import wraps
from django.utils.decorators import decorator_from_middleware_with_args
from .models import UserActionLog
from django.utils import timezone

# decorators.py

def custom_log_action(action_type, model, details=None):
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            return view_func(request, *args, **kwargs)

        # <<< Attach at decoration time, so middleware sees it immediately
        wrapped_view.action_logging = {
            'action_type': action_type,
            'model':       model,
            'details':     details or {}
        }

        return wrapped_view
    return decorator
#⚠️AFTER THIS⚠️
    #middleware is kinda listening to this 'action_logging' => ActionLoggerMiddleware
