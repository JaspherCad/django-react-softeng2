from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache


# HOW THIS WORKS??
#https://www.django-rest-framework.org/api-guide/permissions/ 
#@permission_classes([IsAuthenticated])
# @permission_classes([IsAuthenticated, IsTeller])  # GROUP BASED PERMISSION (not actual role)
#so if I click the isAuthenticated.... then ill be seeing this
# class IsAuthenticated(BasePermission):
#     """
#     Allows access only to authenticated users.
#     """

#     def has_permission(self, request, view):
#         return bool(request.user and request.user.is_authenticated)


#so i have to mimich this where a class must inerit (BasePermission)
    #and inside this class we have function def has_permission that must return true

    #def has_permission:
        #if self.role_name mathces request.user.groups.valeList then return true
        #currnet_role_LIST = request.user.groups.values_lsit('get the name' flat=TRUE)  
        #if currnet_role_LIST.contains(requiredRole) return true
            #kuwnari role ko is teller,admin,doctor then if requiredROle is doctor then return true.. AT LEAST ONE REQ MATCH

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
            print(roles)

        if self.role_name in roles:
            print("TRUE")
            return True

        # raise PermissionDenied(f"FAILED: Your roles are {roles}. Only {self.role_name}s can access this resource.")

        #instead of raising an error immediately, simply return False FOR TESTINGS
        return False












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