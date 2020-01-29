from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as django_filters

from .serializers import ScreeningSerializer, RoomSerializer
from .models import Screening, Room

from .filters import ScreeningFilter
from .paginators import ScreeningPagination

class ScreeningViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Screening.objects.all()
    serializer_class = ScreeningSerializer
    pagination_class = ScreeningPagination
    filterset_class = ScreeningFilter
    filter_backends = (django_filters.DjangoFilterBackend, OrderingFilter)
    ordering_fields = ['pk', 'date']
    ordering = ['-date']

    def list(self, request):
        if request.query_params.get('fields') is None:
            fields = ['id', 'name', 'url', 'date']
        else:
            fields = request.query_params.get('fields').split(',')
        
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, fields=fields, context={'request': request}) 
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, fields=fields, context={'request': request}) 
        return Response(serializer.data)

class RoomViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer