import json
from datetime import timedelta

from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.response import Response

from .serializers import MovieSerializer, MarathonSerializer
from .models import Movie, Marathon

from .filters import MovieFilter, MarathonFilter
from .paginators import StandardPagination

class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    pagination_class = StandardPagination
    filterset_class = MovieFilter

    def list(self, request):
        if request.query_params.get('fields') is None:
            fields = ['id', 'name', 'url']
        else:
            fields = request.query_params.get('fields').split(',')

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset.order_by('-tickets_sale_date'))
        if page is not None:
            serializer = self.get_serializer(page, many=True, fields=fields, context={'request': request}) 
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, fields=fields, context={'request': request}) 
        return Response(serializer.data)

class MarathonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Marathon.objects.all()
    serializer_class = MarathonSerializer
    pagination_class = StandardPagination
    filterset_class = MarathonFilter

    def list(self, request):
        if request.query_params.get('fields') is None:
            fields = ['id', 'title', 'url']
        else:
            fields = request.query_params.get('fields').split(',')
        
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset.order_by('-tickets_sale_date'))
        if page is not None:
            serializer = self.get_serializer(page, many=True, fields=fields, context={'request': request}) 
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, fields=fields, context={'request': request}) 
        return Response(serializer.data)