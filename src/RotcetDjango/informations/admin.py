from django.contrib import admin
from .models import News, FAQs

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'day_posted')
    readonly_fields = ('day_posted',)
    fields = ('day_posted', 'title', 'image', 'short_description', 'description_html')
    ordering = ['day_posted']
    search_fields = ['title', 'day_posted']

admin.site.register(FAQs)
