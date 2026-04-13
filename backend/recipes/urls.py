"""
URL patterns for the recipes app.
These are included under /api/ in core/urls.py.
"""

from django.urls import path
from .views import (
    RecipeListCreateView,
    RecipeDetailView,
    ReviewListCreateView,
    FavoriteListToggleView,
)

urlpatterns = [
    # Recipes
    path("recipes/",      RecipeListCreateView.as_view(), name="recipe-list"),
    path("recipes/<int:pk>/", RecipeDetailView.as_view(), name="recipe-detail"),

    # Reviews
    path("reviews/",      ReviewListCreateView.as_view(), name="review-list"),

    # Favorites
    path("favorites/",    FavoriteListToggleView.as_view(), name="favorites"),
]
