import datetime
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase
from scripts.tools import cleanup_tests_media

from .models import News, FAQs
from .models_values import news_values, faqs_values

class NewsTests(APITestCase):

    @classmethod
    def tearDownClass(cls):
        cleanup_tests_media()

    def setUp(self):
        news1 = News.objects.create(**news_values) # should be 2
        news2 = News.objects.create(**news_values) # should be 1
        news3 = News.objects.create(**news_values) # should be 3
        news2.day_posted = news2.day_posted + datetime.timedelta(1)
        news3.day_posted = news3.day_posted - datetime.timedelta(1)
        news1.save()
        news2.save()
        news3.save()

    def test_order(self):
        url = reverse('api:news-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        self.assertGreater(data[0]['day_posted'], data[1]['day_posted'])
        self.assertGreater(data[0]['day_posted'], data[2]['day_posted'])

class FAQsTests(APITestCase):

    def setUp(self):
        faq1 = FAQs.objects.create(**faqs_values) # should be 1
        values = faqs_values.copy()
        values['number'] = 2
        faq2 = FAQs.objects.create(**values) # should be 2
        faq1.save()
        faq2.save()

    def test_order(self):
        url = reverse('api:faqs-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertLess(data[0]['number'], data[1]['number'])

