import re
import threading
from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser
import threading
import logging

import json
from django.utils.deprecation import MiddlewareMixin
from django.contrib.contenttypes.models import ContentType
from .models import UserActionLog
from ipware import get_client_ip


# MIDDLEWARE?????????

#TLDR para siyang AXIOS response  /  request interceptor
        # Common Use Cases for Middleware
        # - Authentication: Check if a user is authenticated before processing the request.
        # - Logging: Log request and response details for debugging or auditing.
        # - Performance Monitoring: Measure the time taken for processing requests.
        # - CORS Handling: Modify headers for cross-origin resource sharing.
        # - Request Modifications: Add custom data to requests like IP addresses, user agents, etc.

# Signals run outside the normal request/response flow—they’re tied to the ORM. By default they have no knowledge of request or request.user.

#REQUEST --> middleware --> VIEW -->  THEN RESPONSE

# Middleware, on the other hand, does see the request and the authenticated user, but it lives at the view-level, not the model-level.


#Since we cant access the request.user on signals, store requst.user on middleware's thread local and user it later.
_thread_locals = threading.local()
logger = logging.getLogger(__name__)


def get_current_user():
    return getattr(_thread_locals, 'user', None)

class ThreadLocalUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    @staticmethod
    def get_user_from_jwt(request):
        jwt_auth = JWTAuthentication()
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        # Match "Bearer <token>"
        token_match = re.match(r'Bearer\s+(\S+)', auth_header, re.IGNORECASE)
        
        if token_match:
            raw_token = token_match.group(1)
            try:
                validated_token = jwt_auth.get_validated_token(raw_token)
                user = jwt_auth.get_user(validated_token)
                return user
            except Exception as e:
                # Log invalid token error if needed
                pass
        return None  # Return None if no token or invalid

    def __call__(self, request):
        # Only attempt JWT auth if no user is authenticated yet
        if not request.user.is_authenticated:
            jwt_user = self.get_user_from_jwt(request)
            if jwt_user and jwt_user.is_authenticated:
                # Override request.user only if JWT auth succeeds
                request.user = SimpleLazyObject(lambda: jwt_user)
        
        # Store the final user (session/JWT/anonymous) in thread-local storage
        _thread_locals.user = request.user
        response = self.get_response(request)
        _thread_locals.user = None
        return response
    
class ActionLoggerMiddleware(MiddlewareMixin):
# middleware.py
    def process_view(self, request, view_func, view_args, view_kwargs):
        logger.debug(f"Processing view: {view_func.__name__}")
        action_info = getattr(view_func, 'action_logging', None)
        
        logger.warning(f"action_info: {action_info}")
        
        if not action_info:
            logger.warning("No action_logging metadata found")
            return None

        try:
            content_type = ContentType.objects.get_for_model(action_info['model'])

            request._action_log = UserActionLog(
                user=request.user if request.user.is_authenticated else None,
                action_type=action_info['action_type'],
                content_type=content_type,
                object_id=view_kwargs.get('pk'),
                object_repr=str(action_info['model'].__name__),
                details=action_info.get('details', {})
            )
            logger.debug("Action logging metadata applied")
        except Exception as e:
            logger.error(f"Error creating log entry: {str(e)}")
            
def process_response(self, request, response):
    log_entry = getattr(request, '_action_log', None)
    logger.warning(f"log_entry: {log_entry}")

    if log_entry:
        ip, _ = get_client_ip(request)
        log_entry.ip_address = ip

        try:
            # Update object_repr if possible
            if log_entry.object_id:
                obj = log_entry.content_type.model_class().objects.get(pk=log_entry.object_id)
                log_entry.object_repr = str(obj)
        except Exception as e:
            logger.warning(f"Could not fetch object: {e}")

        try:
            log_entry.save()
            logger.debug(f"Logged action: {log_entry}")
        except Exception as e:
            logger.error(f"Failed to save log: {str(e)}")

    return response