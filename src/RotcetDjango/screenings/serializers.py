from django.urls import reverse
from rest_framework import serializers
from .models import Screening, Room

class ScreeningListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()

    class Meta:
        model = Screening
        fields = ['pk', 'link', 'name', 'type', 'date', 'in_3D']

    def get_name(self, obj):
        return obj.show.get_show_name()
    
    def get_type(self, obj):
        return obj.show.type
    
    def get_link(self, obj):
        request = self.context['request']
        path = reverse('api_screenings:screening-detail', kwargs={'pk': obj.id})
        absolute_path = request.build_absolute_uri(path)
        return absolute_path


class ScreeningDetailSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    room = serializers.SerializerMethodField()

    class Meta:
        model = Screening
        fields = ['pk', 'name', 'type', 'date', 'room', 'occupied_seats', 'in_3D', 'show']
    
    def get_name(self, obj):
        return obj.show.get_show_name()

    def get_type(self, obj):
        return obj.show.type

    def get_room(self, obj):
        return obj.room.number

class RoomViewSet(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = ['pk', 'number', 'seats', 'room_scheme']