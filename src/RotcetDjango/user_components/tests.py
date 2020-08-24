from http import HTTPStatus
from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse

from .forms import UserRegistrationForm

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
        