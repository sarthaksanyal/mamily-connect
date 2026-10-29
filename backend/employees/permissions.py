from rest_framework.permissions import SAFE_METHODS, BasePermission

from accounts.models import User


class EmployeeDirectoryPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in (User.Role.MANAGER, User.Role.ADMIN)
