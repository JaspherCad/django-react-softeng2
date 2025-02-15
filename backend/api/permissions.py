from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache

class HasRole(permissions.BasePermission):
    role_name = None

    def has_permission(self, request, view):
        if not self.role_name:
            raise ValueError("role_name must be set in the subclass.")

        cache_key = f"user_{request.user.id}_roles"
        print("cache_key = " + cache_key)
        roles = cache.get(cache_key)

        if not roles:
            roles = list(request.user.groups.values_list('name', flat=True))
            cache.set(cache_key, roles, timeout=60 * 5)  # Cache for 5 minutes

        if self.role_name in roles:
            return True

        raise PermissionDenied(f"FAILED: Your roles are {roles}. Only {self.role_name}s can access this resource.")
# class HasRole(permissions.BasePermission):
#     """
#     Generic permission class to check if the user has a specific role.
#     """
#     role_name = None  # Override this in subclasses

#     def has_permission(self, request, view): #GOAL? return true.... if error THROW ERROR
#         if not self.role_name:
#             raise ValueError("role_name must be set in the subclass.")

#         # Check if the user belongs to the specified group
#         if request.user.groups.filter(name=self.role_name).exists(): #do currentUser has the role_name?
#             return True

#         # If the user doesn't have the required role, raise PermissionDenied
#         user_roles = list(request.user.groups.values_list('name', flat=True))
#         raise PermissionDenied(f"FAILED: Your roles are {user_roles}. Only {self.role_name}s can access this resource.")
#         #currentUser_roles  =request.user.groups.values_list('name') => then use this for error return



#🔹 What happens here?

    # IsTeller inherits has_permission() from HasRole but sets role_name = "Teller".
    # IsDoctor inherits has_permission() but sets role_name = "Doctor".
class IsTeller(HasRole):
    role_name = "Teller"

class IsAdmin(HasRole):
    role_name = "Admin"

class IsDoctor(HasRole):
    role_name = "Doctor"

class IsNurse(HasRole):
    role_name = "Nurse"

class IsReceptionist(HasRole):
    role_name = "Receptionist"