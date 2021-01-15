from http import HTTPStatus
from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from django.core.exceptions import ValidationError

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

class TicketTestCase(TestCase):

    def setUp(self):
        user = User.objects.create_user(username='test@email.com', email='test@email.com', password='testpassword123')
        self.user = User.objects.get(pk=1)

        Membership.objects.create(user=self.user, type=1, is_active=True)

        Movie.objects.create(**movie_values)
        Room.objects.create(**room_values)

        movie = Movie.objects.get(pk=1)
        Show.objects.create(type='MV', movie=movie)

        show = Show.objects.get(pk=1)
        room = Room.objects.get(pk=1)

        screening_values['show'] = show
        screening_values['room'] = room
        screening_values['occupied_seats'] = '1,2'

        self.screening = Screening.objects.create(**screening_values)

    def test_adds_seat_to_session_occupied_seats(self):
        Ticket.objects.create(user=self.user, screening=self.screening, type=0, seat=3)
        screening = Screening.objects.get(pk=1)
        self.assertEqual('1,2,3', screening.occupied_seats)

    def test_bulk_create_does_not_add_to_session_occupied_seats(self):
        Ticket.objects.create(user=self.user, screening=self.screening, type=0, seat=3, bulk_create=True)
        screening = Screening.objects.get(pk=1)
        self.assertEqual('1,2', screening.occupied_seats)

    def test_changes_seat_in_session_occupied_seats_on_edit(self):
        Ticket.objects.create(user=self.user, screening=self.screening, type=0, seat=3)
        ticket = Ticket.objects.get(pk=1)
        ticket.seat = 4
        ticket.save()

        screening = Screening.objects.get(pk=1)

        self.assertEqual('1,2,4', screening.occupied_seats)

    def test_blocks_type_change_if_member_tickets_full(self):
        Ticket.objects.create(user=self.user, screening=self.screening, type=0, seat=3)
        Ticket.objects.create(user=self.user, screening=self.screening, type=2, seat=3)
        ticket = Ticket.objects.get(pk=1)
        ticket.type = 2

        self.assertRaises(ValidationError, ticket.clean)
    
    def test_type_in_range(self):
        ticket = Ticket(user=self.user, screening=self.screening, type=4, seat=3)
        self.assertRaises(ValidationError, ticket.clean)
    
    def test_seat_already_occupied(self):
        ticket = Ticket(user=self.user, screening=self.screening, type=4, seat=2)
        self.assertRaises(ValidationError, ticket.clean)

    def test_member_tickets_full(self):
        Ticket.objects.create(user=self.user, screening=self.screening, type=2, seat=3)
        ticket = Ticket(user=self.user, screening=self.screening, type=2, seat=4)
        self.assertRaises(ValidationError, ticket.clean)

class TicketApiTestCase(APITestCase):

    def setUp(self):
        self.url = reverse('api:ticket-list')
        self.bulk_url = reverse('user:tickets_multiple_creation')

        user = User.objects.create_user(username='test@email.com', email='test@email.com', password='testpassword123')
        self.user = User.objects.get(pk=1)

        Membership.objects.create(user=self.user, type=1, is_active=False)

        Movie.objects.create(**movie_values)
        Room.objects.create(**room_values)

        movie = Movie.objects.get(pk=1)
        Show.objects.create(type='MV', movie=movie)

        show = Show.objects.get(pk=1)
        room = Room.objects.get(pk=1)

        screening_values['show'] = show
        screening_values['room'] = room
        screening_values['occupied_seats'] = '1,2'

        self.screening = Screening.objects.create(**screening_values)
        
    def test_get_forbidden_for_not_logged(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)
        self.assertEqual(response.data['details'], 'User not authenticated')

    def test_post_forbidden_for_not_logged(self):
        response = self.client.post(self.url, {
            "type": 0,
            "seat": 3,
            "screening": 1
        })

        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'User not authenticated')

    def test_ticket_booking(self):
        self.client.login(email='test@email.com', password='testpassword123')

        response = self.client.post(self.url, {
            "type": 0,
            "seat": 3,
            "screening": 1
        })
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
    
    def test_incorrect_type(self):
        self.client.login(email='test@email.com', password='testpassword123')

        response = self.client.post(self.url, {
            "type": 3,
            "seat": 3,
            "screening": 1
        })
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'Incorrect ticket type')

    def test_seat_already_occupied(self):
        self.client.login(email='test@email.com', password='testpassword123')

        response = self.client.post(self.url, {
            "type": 0,
            "seat": 1,
            "screening": 1
        })
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'Seat already booked')

    def test_user_not_member(self):
        self.client.login(email='test@email.com', password='testpassword123')

        response = self.client.post(self.url, {
            "type": 2,
            "seat": 3,
            "screening": 1
        })
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'Requested member ticket for non member user')

    def test_member_ticket_book(self):
        membership = Membership.objects.get(pk=1)
        membership.is_active = True
        membership.save()

        self.client.login(email='test@email.com', password='testpassword123')

        response = self.client.post(self.url, {
            "type": 2,
            "seat": 3,
            "screening": 1
        })
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
    
    def test_member_tickets_full(self):
        membership = Membership.objects.get(pk=1)
        membership.is_active = True
        membership.save()
        user = User.objects.get(pk=1)
        screening = Screening.objects.get(pk=1)
        Ticket.objects.create(user=user, screening=screening, seat=3, type=2)

        self.client.login(email='test@email.com', password='testpassword123')

        response = self.client.post(self.url, {
            "type": 2,
            "seat": 5,
            "screening": 1
        })
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'User has already used all member tickets for this show')
        
    def test_seat_out_of_range(self):
        self.client.login(email='test@email.com', password='testpassword123')

        response = self.client.post(self.url, {
            "type": 0,
            "seat": 9999,
            "screening": 1
        })
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'There is no seat with that number')
    
    def test_multiple_tickets_creation(self):
        self.client.login(email='test@email.com', password='testpassword123')
        response = self.client.post(self.bulk_url, {
            "types": '0,0,1',
            "seats": '3,4,5',
            "screening": 1
        })

        tickets = len(Ticket.objects.filter(user=1))
        screening = Screening.objects.get(pk=1)

        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(screening.occupied_seats, '1,2,3,4,5')
        self.assertEqual(tickets, 3)

    def test_multiple_tickets_creation_types_validation(self):
        self.client.login(email='test@email.com', password='testpassword123')
        response = self.client.post(self.bulk_url, {
            "types": '3,1',
            "seats": '3,1',
            "screening": 1
        })

        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'Incorrect ticket type')

    def test_multiple_tickets_creation_seats_validation(self):
        self.client.login(email='test@email.com', password='testpassword123')
        response = self.client.post(self.bulk_url, {
            "types": '0,2',
            "seats": '1,2',
            "screening": 1
        })
        
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'Seats already booked')

    def test_multiple_tickets_creation_types_equals_seats(self):
        self.client.login(email='test@email.com', password='testpassword123')
        response = self.client.post(self.bulk_url, {
            "types": '0,2',
            "seats": '1,2,1',
            "screening": 1
        })
        
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'Lenght of types and seats is not equal')

    def test_multiple_tickets_creation_adds_member_tickets_if_any_left(self):
        membership = Membership.objects.get(pk=1)
        membership.type = 2
        membership.is_active = True
        membership.save()

        Ticket.objects.create(user=self.user, seat=3, type=2, screening=self.screening)

        self.client.login(email='test@email.com', password='testpassword123')
        response = self.client.post(self.bulk_url, {
            "types": '2',
            "seats": '5',
            "screening": 1
        })
        
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(len(self.user.tickets.filter(type=2)), 2)

    def test_multiple_tickets_creation_too_many_member_tickets(self):
        membership = Membership.objects.get(pk=1)
        membership.is_active = True
        membership.save()

        Ticket.objects.create(user=self.user, seat=3, type=2, screening=self.screening)

        self.client.login(email='test@email.com', password='testpassword123')
        response = self.client.post(self.bulk_url, {
            "types": '2',
            "seats": '5',
            "screening": 1
        })
        
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'User has already used member tickets for this show')

    def test_multiple_tickets_creation_out_of_range(self):
        self.client.login(email='test@email.com', password='testpassword123')
        response = self.client.post(self.bulk_url, {
            "types": '0',
            "seats": '500',
            "screening": 1
        })
        
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'There is no seat with one of given numbers')

    def test_multiple_tickets_creation_not_member(self):
        self.client.login(email='test@email.com', password='testpassword123')
        response = self.client.post(self.bulk_url, {
            "types": '2',
            "seats": '5',
            "screening": 1
        })
        
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data['details'], 'Requested member ticket for non member user')