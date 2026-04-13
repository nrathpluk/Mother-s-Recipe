"""
Database models for Mother's Recipe.
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Recipe(models.Model):
    """A recipe posted by a user."""

    DIFFICULTY_CHOICES = [
        ("easy",   "Easy"),
        ("medium", "Medium"),
        ("hard",   "Hard"),
    ]

    title        = models.CharField(max_length=200)
    description  = models.TextField()
    # Store as JSON list, e.g. ["2 cups flour", "1 tsp salt"]
    ingredients  = models.JSONField(default=list)
    # Store as JSON list, e.g. ["Mix flour and salt", "Add water"]
    steps        = models.JSONField(default=list)
    cooking_time = models.IntegerField(help_text="Cooking time in minutes")
    difficulty   = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default="easy")
    image_url    = models.URLField(blank=True, default="")
    created_by   = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]   # newest first

    def __str__(self):
        return self.title

    def average_rating(self):
        """Calculate the average rating from all reviews."""
        reviews = self.reviews.all()
        if not reviews:
            return None
        return round(sum(r.rating for r in reviews) / len(reviews), 1)


class Review(models.Model):
    """A star rating + comment left on a recipe."""

    recipe     = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="reviews")
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating     = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        # One review per user per recipe
        unique_together = ["recipe", "user"]

    def __str__(self):
        return f"{self.user.username} → {self.recipe.title} ({self.rating}★)"


class Favorite(models.Model):
    """Tracks which recipes a user has saved as favorites."""

    user   = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="favorited_by")

    class Meta:
        # A user can only favorite a recipe once
        unique_together = ["user", "recipe"]

    def __str__(self):
        return f"{self.user.username} ♥ {self.recipe.title}"
