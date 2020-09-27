from django.contrib import admin
from .models import Screening, Show, Room

@admin.register(Screening)
class ScreeningAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'show', 'room')
    readonly_fields = ['occupied_seats']
    autocomplete_fields = ('show',)
    ordering = ['date']
    search_fields = ['show__movie__name','show__marathon__title', 'date']

@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'type')
    list_filter = ('type',)
    autocomplete_fields = ('movie', 'marathon')
    search_fields = ('movie__name', 'marathon__title')
    

admin.site.register(Room)
