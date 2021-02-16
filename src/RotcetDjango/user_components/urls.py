from django.urls import path, re_path
from . import views

app_name = 'react'

urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('api/session/', views.is_logged, name='session'),
    path('api/tickets-multiple-creation', views.multiple_tickets_creation, name='tickets_multiple_creation'),
    path('api/update-details', views.update_details, name='update_details')
]