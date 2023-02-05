import random, string

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as user_login, logout as user_logout
from django.contrib.auth.models import User
from django.contrib import messages

from rest_framework.decorators import api_view
from rest_framework.response import Response

from scripts.tools import string_list_to_python
from screenings.models import Screening

from .validators import multiple_tickets_creation_validation

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


def guest_login(request):
    if request.user.is_authenticated:
        return redirect('/')
    
    email = f"guest{''.join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=8))}@rotcet.com"
    password = "guest"
    User.objects.create_user(username=email, email=email, password=password)
    user = authenticate(request, email=email, password=password)

    user_login(request, user)
    Membership.objects.create(user=request.user, type=1, is_active=True)

    if 'next' in request.GET:
        return redirect('/'+request.GET['next'])
    elif 'next' in request.POST:
        return redirect(request.POST['next'])
    else:
        return redirect('/')


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

    user =  request.user
    types = string_list_to_python(request.data['types'])
    seats = string_list_to_python(request.data['seats'])
    user_custom_details = request.data['details']
    screening = request.data['screening']

    screening = Screening.objects.get(pk=screening)

    occupied_seats = string_list_to_python(screening.occupied_seats)
    member_tickets = Ticket.objects.filter(screening=screening, user=user, type=2).count()

    # check if a user has details
    try:
        user_details = user.details
    except User.details.RelatedObjectDoesNotExist:
        user_details = None
    custom_details = True if user_custom_details != user_details else False 

    if not user.is_authenticated:
        return Response({'details': 'User not authenticated'}, status=403)

    #VALIDATION
    error = multiple_tickets_creation_validation(user, screening, types, member_tickets, seats, occupied_seats)
    if error is not None:
        return Response(error['details'], status=error['status'])

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

@api_view(['POST'])
def update_details(request):

    user =  request.user
    user_details = request.data['details']

    if not user.is_authenticated:
        return Response({'details': 'User not authenticated'}, status=403)

    # update details if user has them, if not - create a new one
    try:
        details_exists = UserDetails.objects.filter(user=user)
        if not details_exists:
            UserDetails.objects.create(user=user, name=user_details['name'], surname=user_details['surname'],
            address=user_details['address'], postcode=user_details['postcode'])
        else:
            UserDetails.objects.filter(user=user).update(name=user_details['name'], surname=user_details['surname'],
            address=user_details['address'], postcode=user_details['postcode'])
    except:
        return Response({'details': 'An error accured during details update'}, status=500)

    return Response({'details': 'Details updated successfully'}, status=201)