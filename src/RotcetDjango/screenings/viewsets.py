from rest_framework import viewsets

from .serializers import ScreeningListSerializer, ScreeningDetailSerializer, RoomViewSet
from .models import Screening, Room

class ScreeningViewSet(viewsets.ModelViewSet):
    queryset = Screening.objects.all()


    def get_serializer_class(self):
        return ScreeningListSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return ScreeningListSerializer
        if self.action == 'retrieve':
            return ScreeningDetailSerializer
        return ScreeningListSerializer
    
    def get_serializer_context(self):
        return {'request': self.request}

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomViewSet