from rest_framework import serializers
from .models import News, FAQs

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
            # Don't pass the 'fields' arg up to the superclass
            fields = kwargs.pop('fields', None)

            # Instantiate the superclass normally
            super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

            if fields is not None:
                # Drop any fields that are not specified in the `fields` argument.
                allowed = set(fields)
                existing = set(self.fields)
                for field_name in existing - allowed:
                    self.fields.pop(field_name)

class NewsSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = News
        fields = '__all__'

class FAQsSerializer(serializers.ModelSerializer):

    class Meta:
        model = FAQs
        fields = '__all__'