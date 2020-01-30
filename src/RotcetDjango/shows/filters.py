import django_filters

from .models import Movie, Marathon

class MovieFilter(django_filters.FilterSet):

    class Meta:
        model = Movie
        exclude = ['main_image']
        fields = '__all__'

class MarathonFilter(django_filters.FilterSet):

    class Meta:
        model = Marathon
        exclude = ['image', 'description_html']
        fields = '__all__'