"""
API views for Mother's Recipe.
"""

from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import Recipe, Review, Favorite
from .serializers import (
    RegisterSerializer,
    RecipeListSerializer,
    RecipeDetailSerializer,
    ReviewSerializer,
    FavoriteSerializer,
)
from .permissions import IsOwnerOrReadOnly


# ---------------------------------------------------------------------------
# Auth Views
# ---------------------------------------------------------------------------

class RegisterView(APIView):
    """
    POST /api/auth/register/
    Create a new user account and return JWT tokens immediately.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens so the user is logged in right after registering
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {"id": user.id, "username": user.username, "email": user.email},
                "access":  str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class GoogleLoginView(APIView):
    """
    POST /api/auth/google/
    Verify a Google Identity Services credential (ID token), then return JWT tokens.
    Creates a new User if this is the first time this Google account logs in.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get("credential", "").strip()
        if not credential:
            return Response(
                {"detail": "credential is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify the Google ID token with Google's public keys
        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID or None,  # None skips audience check (dev only)
            )
        except ValueError:
            return Response(
                {"detail": "Invalid or expired Google token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email      = idinfo.get("email", "")
        given_name = idinfo.get("given_name", "")
        family_name = idinfo.get("family_name", "")

        if not email:
            return Response(
                {"detail": "Google account has no email."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find existing user by email, or create a new one
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Build a unique username from the part before @
            base = email.split("@")[0]
            username = base
            counter  = 1
            while User.objects.filter(username=username).exists():
                username = f"{base}{counter}"
                counter += 1

            user = User(
                username=username,
                email=email,
                first_name=given_name,
                last_name=family_name,
            )
            user.set_unusable_password()   # no password — Google auth only
            user.save()

        if not user.is_active:
            return Response(
                {"detail": "This account is disabled."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user":    {"id": user.id, "username": user.username, "email": user.email},
                "access":  str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    Authenticate with username + password and return JWT tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        # Manually look up and verify the user
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"detail": "This account is disabled."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {"id": user.id, "username": user.username, "email": user.email},
                "access":  str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


# ---------------------------------------------------------------------------
# Recipe Views
# ---------------------------------------------------------------------------

class RecipeListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/recipes/       — public paginated list
    POST /api/recipes/       — create (auth required)
    GET  /api/recipes/?search=kw — search by title or ingredient
    """
    queryset = Recipe.objects.all().prefetch_related("reviews")
    permission_classes = [IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # ?search=keyword searches both the title and the ingredients JSON field
    search_fields = ["title", "description", "ingredients"]
    ordering_fields = ["created_at", "cooking_time"]

    def get_serializer_class(self):
        return RecipeListSerializer

    def perform_create(self, serializer):
        # Automatically set the owner to the logged-in user
        serializer.save(created_by=self.request.user)


class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/recipes/{id}/ — public detail
    PUT    /api/recipes/{id}/ — update (owner only)
    DELETE /api/recipes/{id}/ — delete (owner only)
    """
    queryset = Recipe.objects.all().prefetch_related("reviews__user")
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = RecipeDetailSerializer


# ---------------------------------------------------------------------------
# Review Views
# ---------------------------------------------------------------------------

class ReviewListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/reviews/?recipe={id} — list reviews for a recipe
    POST /api/reviews/             — create a review (auth required)
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.select_related("user")
        recipe_id = self.request.query_params.get("recipe")
        if recipe_id:
            queryset = queryset.filter(recipe_id=recipe_id)
        return queryset

    def perform_create(self, serializer):
        recipe_id = self.request.data.get("recipe")
        if not recipe_id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"recipe": "This field is required."})

        # Prevent duplicate reviews
        if Review.objects.filter(recipe_id=recipe_id, user=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"detail": "You have already reviewed this recipe."})

        recipe = Recipe.objects.get(pk=recipe_id)
        serializer.save(user=self.request.user, recipe=recipe)


# ---------------------------------------------------------------------------
# Favorite Views
# ---------------------------------------------------------------------------

class FavoriteListToggleView(APIView):
    """
    GET  /api/favorites/ — list the current user's favorites
    POST /api/favorites/ — toggle a recipe as favorite/unfavorite
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related(
            "recipe__created_by"
        ).prefetch_related("recipe__reviews")
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        recipe_id = request.data.get("recipe_id")
        if not recipe_id:
            return Response(
                {"detail": "recipe_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            recipe = Recipe.objects.get(pk=recipe_id)
        except Recipe.DoesNotExist:
            return Response(
                {"detail": "Recipe not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        favorite, created = Favorite.objects.get_or_create(
            user=request.user, recipe=recipe
        )

        if not created:
            # Already favorited → unfavorite (toggle behavior)
            favorite.delete()
            return Response({"favorited": False, "message": "Removed from favorites."})

        return Response(
            {"favorited": True, "message": "Added to favorites."},
            status=status.HTTP_201_CREATED,
        )
