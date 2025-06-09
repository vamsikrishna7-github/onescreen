from django.db import models
from django.contrib.auth.models import User

class Platform(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=255)  # URL to platform icon
    deep_link_prefix = models.CharField(max_length=255)  # e.g., nflx://, hotstar://
    
    def __str__(self):
        return self.name

class UserPlatform(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    platform = models.ForeignKey(Platform, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('user', 'platform')

class WatchlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    tmdb_id = models.CharField(max_length=50)
    media_type = models.CharField(max_length=10)  # movie or tv
    platform = models.ForeignKey(Platform, on_delete=models.CASCADE)
    poster_path = models.CharField(max_length=255, null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'tmdb_id', 'platform') 