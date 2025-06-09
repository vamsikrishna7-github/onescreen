from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Platform, UserPlatform, WatchlistItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ('id', 'name', 'icon', 'deep_link_prefix')

class UserPlatformSerializer(serializers.ModelSerializer):
    platform_details = PlatformSerializer(source='platform', read_only=True)
    platform = serializers.PrimaryKeyRelatedField(queryset=Platform.objects.all(), write_only=True)
    
    class Meta:
        model = UserPlatform
        fields = ('id', 'platform', 'platform_details', 'is_active')
        read_only_fields = ('id',)

class WatchlistItemSerializer(serializers.ModelSerializer):
    platform = PlatformSerializer(read_only=True)
    
    class Meta:
        model = WatchlistItem
        fields = ('id', 'title', 'tmdb_id', 'media_type', 'platform', 'poster_path', 'added_at')
        read_only_fields = ('user', 'added_at') 