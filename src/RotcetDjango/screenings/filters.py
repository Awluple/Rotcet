import django_filters

from .models import Screening

class ScreeningFilter(django_filters.FilterSet):
    date = django_filters.CharFilter(lookup_expr='icontains')
    show__movie__name = django_filters.CharFilter()
    show__marathon__name = django_filters.CharFilter()
    show__type = django_filters.CharFilter()

    class Meta:
        model = Screening
        fields = '__all__'