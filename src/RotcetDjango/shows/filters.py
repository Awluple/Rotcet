from django_filters import rest_framework as filters
from django_filters import widgets

from .models import Movie, Marathon

class MovieFilter(filters.FilterSet):
    
    screenings = filters.DateTimeFromToRangeFilter(field_name='show__screenings__date', widget=widgets.RangeWidget(attrs={'placeholder': 'yyyy-mm-dd hh:mm:ss'}))

    class Meta:
        model = Movie
        exclude = ['main_image']
        fields = '__all__'

class MarathonFilter(filters.FilterSet):

    class Meta:
        model = Marathon
        exclude = ['image', 'description_html']
        fields = '__all__'