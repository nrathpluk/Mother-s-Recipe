"""
Root URL configuration for Mother's Recipe.
All API routes live under /api/.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from recipes.views import RegisterView, LoginView, GoogleLoginView

urlpatterns = [
    # Django admin panel
    path("admin/", admin.site.urls),

    # Auth endpoints
    path("api/auth/register/",     RegisterView.as_view(),     name="register"),
    path("api/auth/login/",        LoginView.as_view(),        name="login"),
    path("api/auth/google/",       GoogleLoginView.as_view(),  name="google_login"),
    path("api/auth/refresh/",      TokenRefreshView.as_view(), name="token_refresh"),

    # Recipe, Review, Favorite endpoints
    path("api/", include("recipes.urls")),
]
