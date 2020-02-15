from django.urls import path, include
from rest_framework import routers

from screenings.viewsets import ScreeningViewSet, RoomViewSet
from screenings.views import get_server_time
from shows.viewsets import MovieViewSet, MarathonViewSet, SheduleViewSet
from informations.viewsets import NewsViewSet, FAQsViewSet

router = routers.DefaultRouter()
router.register('screenings', ScreeningViewSet)
router.register('rooms', RoomViewSet)
router.register('movies', MovieViewSet)
router.register('marathons', MarathonViewSet)
router.register('shedule', SheduleViewSet, basename='shedule')
router.register('news', NewsViewSet)
router.register('faqs', FAQsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('time/', get_server_time)
]