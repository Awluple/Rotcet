from rest_framework import viewsets

from .models import News, FAQs
from .serializers import NewsSerializer, FAQsSerializer

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.all().order_by('day_posted')
    serializer_class = NewsSerializer

class FAQsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQs.objects.all().order_by('number')
    serializer_class = FAQsSerializer