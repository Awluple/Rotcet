from django.urls import path, re_path
from . import views

app_name = 'react'

urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('api/session/', views.is_logged, name='session')
]