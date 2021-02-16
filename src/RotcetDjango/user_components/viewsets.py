from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status, mixins, status
from rest_framework.response import Response

from scripts.tools import string_list_to_python
from screenings.models import Screening

from .models import Ticket, Membership
from .serializers import TicketSerializer, MembershipSerializer

class TicketsViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def list(self, request):
        if not request.user.is_authenticated:
            return Response({'details': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)
        
        queryset = Ticket.objects.filter(user=request.user).order_by('-screening__date')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({'details': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        ticket = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = TicketSerializer(ticket, context={'request': request})
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        ticket = get_object_or_404(self.get_queryset(), pk=pk)

        if not request.user.is_authenticated or request.user.pk != ticket.user.pk:
            return Response({'details': 'The user logged does not match the ticket owner'}, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(ticket)
        return Response(status=status.HTTP_204_NO_CONTENT)

class MembershipViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):

    def list(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({'details': 'User is not authenticated'}, status=status.HTTP_403_FORBIDDEN)
        queryset = Membership.objects.all()
        membership = queryset.get(user=request.user)

        serializer = MembershipSerializer(membership)

        return Response(serializer.data)
