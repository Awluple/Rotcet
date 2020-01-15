from django.contrib import admin
from .models import Movie, Marathon, Image, Trailer

admin.site.register(Movie)
admin.site.register(Marathon)
admin.site.register(Image)
admin.site.register(Trailer)