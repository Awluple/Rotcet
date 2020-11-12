from django.urls import reverse
from rest_framework import serializers

from scripts.tools import string_list_to_python

from .models import Screening, Room

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

class ScreeningSerializer(DynamicFieldsModelSerializer):
    name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    room = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    show_id = serializers.SerializerMethodField()

    class Meta:
        model = Screening
        fields = '__all__'

    def to_representation(self, instances):
        """Convert `occupied_seats` saved as string to array."""
        ret = super().to_representation(instances)
        if 'occupied_seats' in ret:
            ret['occupied_seats'] = string_list_to_python(ret['occupied_seats'])
        return ret

    def get_url(self,obj):
        request = self.context['request']
        path = reverse('api:screening-detail',kwargs={'pk':obj.pk})
        return request.build_absolute_uri(path)

    def get_name(self, obj):
        return obj.show.get_show_name()

    def get_type(self, obj):
        return obj.show.type

    def get_room(self, obj):
        return obj.room.number

    def get_image(self, obj):
        if obj.show.type == 'MV':
            try:
                return self.context['request'].build_absolute_uri(obj.show.movie.thumbnail.url)
            except ValueError as exc: # catch tests wihout thumbnail
                if str(exc) != "The 'thumbnail' attribute has no file associated with it.":
                    raise
                return self.context['request'].build_absolute_uri(obj.show.movie.main_image.url)
            
        elif obj.show.type == 'MR':
            try:
                if obj.show.marathon.thumbnail:
                    return self.context['request'].build_absolute_uri(obj.show.marathon.thumbnail.url)
                else:
                    return None
            except ValueError as exc: # catch tests wihout thumbnail
                if str(exc) != "The 'thumbnail' attribute has no file associated with it.":
                    raise
                return None
    
    def get_show_id(self, obj):
        if obj.show.type == 'MV':
            return obj.show.movie.pk
        elif obj.show.type == 'MR':
            return obj.show.marathon.pk

class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = ['pk', 'number', 'seats']