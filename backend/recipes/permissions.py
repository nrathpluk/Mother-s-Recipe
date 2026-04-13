"""
Custom DRF permission classes for Mother's Recipe.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Allow anyone to read (GET, HEAD, OPTIONS).
    Allow write access only to the object's owner.

    Usage: add `permission_classes = [IsOwnerOrReadOnly]` to any view.
    The object must have a `created_by` field pointing to a User.
    """

    def has_permission(self, request, view):
        # Safe methods (read) are always allowed.
        # Write methods require authentication.
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read is always allowed
        if request.method in SAFE_METHODS:
            return True
        # Write is only allowed for the owner of the recipe
        return obj.created_by == request.user
