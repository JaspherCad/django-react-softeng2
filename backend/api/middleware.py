import re
import threading
from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser
import threading

# MIDDLEWARE?????????

#TLDR para siyang AXIOS response  /  request interceptor
        # Common Use Cases for Middleware
        # - Authentication: Check if a user is authenticated before processing the request.
        # - Logging: Log request and response details for debugging or auditing.
        # - Performance Monitoring: Measure the time taken for processing requests.
        # - CORS Handling: Modify headers for cross-origin resource sharing.
        # - Request Modifications: Add custom data to requests like IP addresses, user agents, etc.




#REQUEST --> middleware --> VIEW THEN RESPONSE
#Since we cant access the request.user on signals, store requst.user on middleware's thread local and user it later.
_thread_locals = threading.local()

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
            except Exception:
                pass  # Invalid token
        return AnonymousUser()

    def __call__(self, request):
        # Try to authenticate the user from JWT
        request.user = SimpleLazyObject(lambda: self.get_user_from_jwt(request))
        _thread_locals.user = request.user
        response = self.get_response(request)
        _thread_locals.user = None
        return response