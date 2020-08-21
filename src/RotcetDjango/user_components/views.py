from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as user_login
from django.contrib.auth.models import User
from django.contrib import messages

from .forms import UserRegistrationForm

def login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, email=email, password=password)
        if user is not None:
            user_login(request, user)

            return redirect('/')
        
        else:
            messages.add_message(request, messages.ERROR, 'Incorrect email or password')
    
    if request.method == 'GET' and request.user.is_authenticated:
        return redirect('/')

    return render(request, 'login.html')


def register(request):
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