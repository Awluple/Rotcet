from django.urls import reverse
from rest_framework import serializers

from .models import Movie, Marathon, Image, Trailer

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
            # Don't pass the 'fields' arg up to the superclass
            fields = kwargs.pop('fields', None)

            # Instantiate the superclass normally
            super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

            if fields is not None:
                # Drop any fields that are not specified in the `fields` argument.
                allowed = set(fields)
                existing = set(self.fields)
                for field_name in existing - allowed:
                    self.fields.pop(field_name)


class TrailerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trailer
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = '__all__'

class MovieSerializer(DynamicFieldsModelSerializer):
    url = serializers.SerializerMethodField()
    screenings = serializers.SerializerMethodField()
    trailers = TrailerSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = '__all__'
    
    def get_url(self, obj):
        request = self.context['request']
        path = reverse('api:movie-detail',kwargs={'pk':obj.pk})
        return request.build_absolute_uri(path)
    
    def get_screenings(self, obj):
        if not hasattr(obj, 'show'):
            return []
            
        shows = obj.show.screenings.all()
        screenings = [{'id': screening.id, 'date': screening.date} for screening in shows]
        return screenings

class MarathonSerializer(DynamicFieldsModelSerializer):
    url = serializers.SerializerMethodField()
    screenings = serializers.SerializerMethodField()

    class Meta:
        model = Marathon
        fields = '__all__'
    
    def get_url(self,obj):
        request = self.context['request']
        path = reverse('api:marathon-detail',kwargs={'pk':obj.pk})
        return request.build_absolute_uri(path)
    
    def get_screenings(self, obj):
        if not hasattr(obj, 'show'):
            return []
            
        shows = obj.show.screenings.all()
        screenings = [{'id': screening.id, 'date': screening.date} for screening in shows]
        return screenings