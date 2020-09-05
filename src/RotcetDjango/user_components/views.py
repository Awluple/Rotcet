from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as user_login, logout as user_logout
from django.contrib.auth.models import User
from django.contrib import messages

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .forms import UserRegistrationForm

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
            return redirect('/')

        return render(request, 'register.html', {'form': form})

    form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})

def logout(request):
    user_logout(request)
    return redirect('/')

@api_view()
def is_logged(request):
    if(request.user.is_authenticated):
        return Response({"logged": True})
    else:
        return Response({"logged": False})