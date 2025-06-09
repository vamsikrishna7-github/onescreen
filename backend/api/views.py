from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Platform, UserPlatform, WatchlistItem
from .serializers import (
    PlatformSerializer,
    UserPlatformSerializer,
    WatchlistItemSerializer
)

class PlatformViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserPlatformViewSet(viewsets.ModelViewSet):
    serializer_class = UserPlatformSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserPlatform.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WatchlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        platform_id = request.data.get('platform_id')
        platform = get_object_or_404(Platform, id=platform_id)
        
        # Check if user has access to this platform
        if not UserPlatform.objects.filter(user=request.user, platform=platform, is_active=True).exists():
            return Response(
                {'error': 'You do not have access to this platform'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, platform=platform)
        return Response(serializer.data, status=status.HTTP_201_CREATED) 