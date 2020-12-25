from django.urls import reverse
from rest_framework import serializers

from scripts.tools import string_list_to_python

from .models import Ticket
from screenings.models import Screening

class TicketSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    screening_details = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ['id', 'url', 'type', 'seat', 'screening', 'screening_details']

    def create(self, validated_data):
        user =  self.context['request'].user
        type = int(validated_data['type'])
        seat = int(validated_data['seat'])
        screening = validated_data['screening']

        occupied_seats = string_list_to_python(screening.occupied_seats)
        member_tickets = Ticket.objects.filter(screening=screening, type=2).count()

        if type not in [0,1,2]:
            raise serializers.ValidationError({'details': 'Incorrect ticket type'})

        if seat in occupied_seats:
            raise serializers.ValidationError({'details': f'Seat already booked', 'seat': seat})

        if type == 2 and not user.membership.is_active:
            raise serializers.ValidationError({'details': 'Requested member ticket for non member user'})
        
        if type == 2 and not member_tickets + 1 <= user.membership.type:
            raise serializers.ValidationError({'details': 'User already used all member tickets for this show'})        
    
        if not seat in range(1, screening.room.seats + 1):
            raise serializers.ValidationError({'details': 'There is no seat with that number', 'seat': seat})

        ticket = Ticket(user=user, type=type, seat=seat, screening=screening)
        ticket.save()

        return ticket
    
    def get_screening_details(self, obj):
        screening = obj.screening

        return {
            "name": screening.show.get_show_name(),
            "room": screening.room.number,
            "date": screening.date
        }
    
    def get_url(self,obj):
        request = self.context['request']
        path = reverse('api:ticket-detail',kwargs={'pk':obj.pk})
        return request.build_absolute_uri(path)