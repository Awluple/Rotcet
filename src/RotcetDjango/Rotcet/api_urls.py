from django.urls import path, include
from rest_framework import routers

from screenings.viewsets import ScreeningViewSet, RoomViewSet
from screenings.views import get_server_time
from shows.viewsets import MovieViewSet, MarathonViewSet
from informations.viewsets import NewsViewSet, FAQsViewSet
from user_components.viewsets import TicketsViewSet

router = routers.DefaultRouter()
router.register('screenings', ScreeningViewSet)
router.register('rooms', RoomViewSet)
router.register('movies', MovieViewSet)
router.register('marathons', MarathonViewSet)
router.register('news', NewsViewSet)
router.register('faqs', FAQsViewSet)
router.register('tickets', TicketsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('time/', get_server_time)
]