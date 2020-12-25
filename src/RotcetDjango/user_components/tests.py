from http import HTTPStatus
from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from shows.models_values import movie_values
from screenings.models_values import room_values, screening_values

from shows.models import Movie
from screenings.models import Room, Screening, Show

from .forms import UserRegistrationForm
from .models import Membership, Ticket

class LoginTestCase(TestCase):

    def setUp(self):
        User.objects.create_user(username='test@email.com', email='test@email.com', password='testpassword123')
        self.url = reverse('user:login')

    def test_login(self):
        response = self.client.post(self.url, data={
            'email': 'test@email.com',
            'password': 'testpassword123'
        }, follow=True)
        self.assertEqual(response.status_code, HTTPStatus.OK)

        self.assertTrue(response.context['user'].is_active)

    def test_wrong_password(self):
        response = self.client.post(self.url, data={
            'email': 'test@email.com',
            'password': 'wrong_testpassword123'
        }, follow=True)

        messages = list(response.context['messages'])

        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(messages), 1)
        self.assertEqual(str(messages[0]), 'Incorrect email or password')
        self.assertFalse(response.context['user'].is_active)
    
    def test_next(self):
        url = '/login/?next=test/1'

        response = self.client.post(url, data={
            'email': 'test@email.com',
            'password': 'testpassword123',
        }, follow=True)
        
        self.assertRedirects(response, '/test/1/')


class LogoutTestCase(TestCase):

    def setUp(self):
        User.objects.create_user(username='test@email.com', email='test@email.com', password='testpassword123')
        self.url = reverse('user:logout')

    def test_logout(self):
        self.assertTrue(self.client.login(email='test@email.com', password='testpassword123'))

        response = self.client.get(self.url, follow=True)
        self.assertFalse(response.context['user'].is_active)

class RegisterTestCase(TestCase):

    def setUp(self):
        self.url = reverse('user:register')

    def test_register(self):
        response = self.client.post(self.url, data={
            'email': 'test@email.com',
            'password': 'testpassword123',
            'password_confirmation': 'testpassword123'
        }, follow=True)

        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(User.objects.all().count(), 1)
        self.assertTrue(response.context['user'].is_active)
    
    def test_membership(self):
        response = self.client.post(self.url, data={
            'email': 'test2@email.com',
            'password': 'testpassword123',
            'password_confirmation': 'testpassword123'
        }, follow=True)

        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(Membership.objects.all().count(), 1)
    
    def test_form_not_valid(self):
        response = self.client.post(self.url, data={
            'email': 'test@email.com',
            'password': 'testpassword123',
            'password_confirmation': 'donotmatch'
        }, follow=True)
        
        messages = list(response.context['messages'])

        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(User.objects.all().count(), 0)

class RegisterFormTestCase(TestCase):

    def test_is_valid(self):
        data = {
            'email': 'test@email.com',
            'password': 'testpassword123',
            'password_confirmation': 'testpassword123'
        }
        form = UserRegistrationForm(data)
        self.assertTrue(form.is_valid())

    def test_password_not_match(self):
        data = {
            'email': 'test@email.com',
            'password': 'testpassword123',
            'password_confirmation': 'donotmatch'
        }
        form = UserRegistrationForm(data=data)
        self.assertFalse(form.is_valid())
    
    def test_email_already_exists(self):
        User.objects.create_user('test', 'exists@email.com', 'testpassword123')
        data = {
            'email': 'exists@email.com',
            'password': 'testpassword123',
            'password_confirmation': 'testpassword123'
        }
        form = UserRegistrationForm(data=data)
        self.assertFalse(form.is_valid())

    def test_password_validation(self):
        data = {
            'email': 'test@email.com',
            'password': '12345678',
            'password_confirmation': '12345678'
        }
        form = UserRegistrationForm(data=data)
        self.assertFalse(form.is_valid())

class SessionApiTestCase(APITestCase):

    def setUp(self):
        self.url = reverse('user:session')
        User.objects.create_user('test', 'test@rotcet.com', 'testpassword123')

        user = User.objects.get(pk=1)
        Membership.objects.create(user=user, is_active=True)

        
    def test_logged_true_if_logged(self):
        self.client.login(email='test@rotcet.com', password='testpassword123')
        response = self.client.get(self.url)

        self.assertTrue(response.data['logged'])

    def test_logged_false_if_not_logged(self):
        response = self.client.get(self.url)
        self.client.logout()
        
        self.assertFalse(response.data['logged'])

    def test_membership_not_exists_if_not_logged(self):
        response = self.client.get(self.url)
        self.client.logout()
        
        self.assertFalse('membership' in response.data)

    def test_membership_exists_if_logged(self):
        self.client.login(email='test@rotcet.com', password='testpassword123')
        response = self.client.get(self.url)
        self.client.logout()
        
        self.assertTrue('membership' in response.data)
        self.assertTrue(response.data['membership'])

class TicketApiTestCase(APITestCase):

    def setUp(self):
        self.url = reverse('api:ticket-list')

        User.objects.create_user(username='test@email.com', email='test@email.com', password='testpassword123')

        Movie.objects.create(**movie_values)
        Room.objects.create(**room_values)

        movie = Movie.objects.get(pk=1)
        Show.objects.create(type='MV', movie=movie)

        show = Show.objects.get(pk=1)
        room = Room.objects.get(pk=1)

        screening_values['show'] = show
        screening_values['room'] = room

        Screening.objects.create(**screening_values)

    def test_forbidden_for_not_logged(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)
        
        