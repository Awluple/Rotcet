from django.test import TestCase, Client
from .views import react

class ReactViewTestCase(TestCase):
    def test_index(self):
        client = Client()
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)