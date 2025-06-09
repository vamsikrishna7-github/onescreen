from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'platforms', views.PlatformViewSet)
router.register(r'user-platforms', views.UserPlatformViewSet, basename='user-platform')
router.register(r'watchlist', views.WatchlistViewSet, basename='watchlist')

urlpatterns = [
    path('', include(router.urls)),
] 