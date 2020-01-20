from rest_framework import serializers
from .models import News, FAQs

class NewsSerializer(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = '__all__'

class FAQsSerializer(serializers.ModelSerializer):

    class Meta:
        model = FAQs
        fields = '__all__'