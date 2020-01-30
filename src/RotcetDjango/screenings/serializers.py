from django.urls import reverse
from rest_framework import serializers

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

    class Meta:
        model = Screening
        fields = '__all__'

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

class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = ['pk', 'number', 'seats', 'room_scheme']