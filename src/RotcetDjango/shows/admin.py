from django.contrib import admin
from .models import Movie, Marathon, Image, Trailer

class Imagesinline(admin.TabularInline):
    model = Image
    extra = 1

class Trailersinline(admin.TabularInline):
    model = Trailer
    extra = 1

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    inlines = [Imagesinline, Trailersinline]
    list_display = ('__str__', 'tickets_sale_date', 'relese_date')
    list_filter = ('highlight', 'has_3D')
    search_fields = ('name', 'tickets_sale_date', 'relese_date')

@admin.register(Marathon)
class MarathonAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'tickets_sale_date')
    search_fields = ('title', 'tickets_sale_date')

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    search_fields = ('movie__name',)

@admin.register(Trailer)
class TrailerAdmin(admin.ModelAdmin):
    search_fields = ('movie__name',)