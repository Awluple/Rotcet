from rest_framework import viewsets

from .models import News, FAQs
from .serializers import NewsSerializer, FAQsSerializer
from .paginators import NewsPagination

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.all().order_by('-day_posted')
    serializer_class = NewsSerializer
    pagination_class = NewsPagination

    def list(self, request):
        if request.query_params.get('fields') is None:
            fields = ['id', 'day_posted', 'title']
        else:
            fields = request.query_params.get('fields').split(',')
        queryset = self.paginate_queryset(self.get_queryset())

        if queryset is not None:
            serializer = self.get_serializer(queryset, many=True, fields=fields, context={'request': request}) 
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True, fields=fields, context={'request': request}) 
        return Response(serializer.data)


class FAQsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQs.objects.all().order_by('number')
    serializer_class = FAQsSerializer