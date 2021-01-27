import collections

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as user_login, logout as user_logout
from django.contrib.auth.models import User
from django.contrib import messages

from rest_framework.decorators import api_view
from rest_framework.response import Response

from scripts.tools import string_list_to_python
from screenings.models import Screening

from .forms import UserRegistrationForm
from .models import Membership, Ticket, CustomDetails, UserDetails

def login(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, email=email, password=password)
        if user is not None:
            user_login(request, user)
            # redirects to the page given in next
            if 'next' in request.GET:
                return redirect('/'+request.GET['next'])
            elif 'next' in request.POST:
                return redirect(request.POST['next'])
            else:
                return redirect('/')
        
        else:
            messages.add_message(request, messages.ERROR, 'Incorrect email or password')

    context = {
        'next': None
    }
    # adds next to the context and adds it as hidden form button in template
    if 'next' in request.GET:
        context['next'] = request.GET['next']
    elif 'next' in request.POST:
        context['next'] = request.POST['next']
    
    if 'login_required' in request.GET:
        messages.add_message(request, messages.INFO, 'You must be logged in to continue')

    return render(request, 'login.html', context=context)


def register(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            User.objects.create_user(username=email, email=email, password=password)
            user = authenticate(request, email=email, password=password)
            user_login(request, user)

            Membership.objects.create(user=request.user)

            return redirect('/')

        return render(request, 'register.html', {'form': form})

    form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})

def logout(request):
    user_logout(request)
    return redirect('/')

@api_view()
def is_logged(request):
    if request.user.is_authenticated:
        membership = request.user.membership.is_active
        membership_type = request.user.membership.type
        
        try:
            user_details = User.objects.get(id=request.user.id).details
            user_details = {
            'name': user_details.name,
            'surname': user_details.surname,
            'address': user_details.address,
            'postcode': user_details.postcode
            }
            
        except User.details.RelatedObjectDoesNotExist :
            user_details = None
        
        return Response({"logged": True, "membership": membership, "membership_type": membership_type,
        "user_details": user_details})
    else:
        return Response({"logged": False})

@api_view(['POST'])
def multiple_tickets_creation(request):
    """ 
    Errors codes: 1: error with ticket type, 2: seat already occupied, 3: error with seat number
    """

    user =  request.user
    types = string_list_to_python(request.data['types'])
    seats = string_list_to_python(request.data['seats'])
    user_custom_details = request.data['details']
    screening = request.data['screening']

    screening = Screening.objects.get(pk=screening)

    occupied_seats = string_list_to_python(screening.occupied_seats)
    member_tickets = Ticket.objects.filter(screening=screening, type=2).count()

    try:
        user_details = user.details
    except User.details.RelatedObjectDoesNotExist:
        user_details = None
    custom_details = True if user_custom_details != user_details else False

    # VALIDATION
    if not user.is_authenticated:
        raise serializers.ValidationError({'details': 'User not authenticated'})

    if len(types) != len(seats):
        return Response({'code': 3,'details': 'Lenght of types and seats is not equal'}, status=400)

    types_valid = map(lambda type: type in [0,1,2], types)

    if False in types_valid:
        return Response({'code': 1,'details': 'Incorrect ticket type'}, status=400)

    # check if all seats are free
    if len(set(seats + occupied_seats)) < (len(seats) + len(occupied_seats)):
        return Response({'code': 2,'details': f'Seats already booked', 'seats': set(occupied_seats).intersection(seats)}, status=400)

    if 2 in types and not user.membership.is_active:
        return Response({'code': 1,'details': 'Requested member ticket for non member user'}, status=400)
    
    types_number = collections.Counter(types)
    # check if a member still has free member tickets for this screening
    if 2 in types and not member_tickets + types_number[2] <= user.membership.type:
        return Response({'code': 1,'details': 'User has already used member tickets for this show', 'left': member_tickets - user.membership.type}, status=400)        

    in_range = map(lambda seat: seat in range(1, screening.room.seats + 1), seats)

    if False in in_range:
        return Response({'code': 3,'details': 'There is no seat with one of given numbers'}, status=400)

    # SAVING TICKETS
    for index, seat in enumerate(seats):
        ticket = Ticket.objects.create(user=user, type=types[index], seat=seat, screening=screening, bulk_create=True)
        
        if custom_details:
            CustomDetails.objects.create(ticket=ticket, name=user_custom_details['name'], surname=user_custom_details['surname'],
            address=user_custom_details['address'], postcode=user_custom_details['postcode'])

            # create user details object if does not exist
            if user_details is None:
                UserDetails.objects.create(user=user, name=user_custom_details['name'], surname=user_custom_details['surname'],
                address=user_custom_details['address'], postcode=user_custom_details['postcode'])

    # adds new seats to the screening's occupied seats
    new_seats = occupied_seats + seats
    screening.occupied_seats = ','.join(map(str, new_seats))
    screening.save()

    return Response({'details': 'Successfully created'}, status=201)