"""
Serializers convert Django model instances to/from JSON.
"""

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recipe, Review, Favorite


# ---------------------------------------------------------------------------
# Auth Serializers
# ---------------------------------------------------------------------------

class RegisterSerializer(serializers.ModelSerializer):
    """Validate and create a new user account."""

    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model  = User
        fields = ["id", "username", "email", "password", "password2"]

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        # Use create_user so Django hashes the password properly
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Read-only representation of a user (shown inside recipes/reviews)."""

    class Meta:
        model  = User
        fields = ["id", "username"]


# ---------------------------------------------------------------------------
# Review Serializer
# ---------------------------------------------------------------------------

class ReviewSerializer(serializers.ModelSerializer):
    """Serializes a Review, including the author's username."""

    user = UserSerializer(read_only=True)

    class Meta:
        model  = Review
        fields = ["id", "user", "rating", "comment", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


# ---------------------------------------------------------------------------
# Recipe Serializers
# ---------------------------------------------------------------------------

class RecipeListSerializer(serializers.ModelSerializer):
    """
    Compact serializer for the recipe list page.
    Only includes fields needed for the card view.
    """

    created_by     = UserSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model  = Recipe
        fields = [
            "id", "title", "description", "cooking_time", "difficulty",
            "image_url", "created_by", "average_rating", "created_at",
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()


class RecipeDetailSerializer(serializers.ModelSerializer):
    """
    Full serializer for the recipe detail page.
    Includes ingredients, steps, and all reviews.
    """

    created_by     = UserSerializer(read_only=True)
    reviews        = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count   = serializers.SerializerMethodField()

    class Meta:
        model  = Recipe
        fields = [
            "id", "title", "description", "ingredients", "steps",
            "cooking_time", "difficulty", "image_url",
            "created_by", "average_rating", "review_count",
            "reviews", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_review_count(self, obj):
        return obj.reviews.count()


# ---------------------------------------------------------------------------
# Favorite Serializer
# ---------------------------------------------------------------------------

class FavoriteSerializer(serializers.ModelSerializer):
    """Serializes a Favorite, including the full recipe card data."""

    recipe = RecipeListSerializer(read_only=True)
    recipe_id = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.all(), write_only=True, source="recipe"
    )

    class Meta:
        model  = Favorite
        fields = ["id", "recipe", "recipe_id"]
        read_only_fields = ["id", "recipe"]
