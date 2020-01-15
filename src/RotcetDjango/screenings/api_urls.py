from django.urls import path, include
from rest_framework import routers

from .viewsets import ScreeningViewSet, RoomViewSet

app_name = 'screenings'

router = routers.DefaultRouter()
router.register('screenings', ScreeningViewSet)
router.register('rooms', RoomViewSet)

urlpatterns = [
    path('', include(router.urls))
]
