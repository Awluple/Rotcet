from django_filters import rest_framework as filters
from django_filters import widgets

from .models import Movie, Marathon

class MovieFilter(filters.FilterSet):
    
    screenings = filters.DateTimeFromToRangeFilter(field_name='show__screenings__date', distinct=True, widget=widgets.RangeWidget(attrs={'placeholder': 'yyyy-mm-dd hh:mm:ss'}))
    has_tickets_sale_date = filters.BooleanFilter(field_name='tickets_sale_date', lookup_expr='isnull', exclude=True)
    relese_date__gt = filters.DateFilter(field_name='relese_date', lookup_expr='gt')

    class Meta:
        model = Movie
        exclude = ['main_image', 'thumbnail']
        fields = '__all__'

class MarathonFilter(filters.FilterSet):

    class Meta:
        model = Marathon
        exclude = ['main_image', 'thumbnail', 'description_html']
        fields = '__all__'