from django.core.management.base import BaseCommand
from screenings.models import Screening
from shows.models import Movie
from user_components.models import Ticket, User, Membership, CustomDetails
import datetime

class Command(BaseCommand):
    help = 'Removes users, tickets and memberships. Adds one day to all screenings\' dates'

    def handle(self, *args, **options):
        try:
            screenings = Screening.objects.all();
            for screening in screenings:
                screening.date = screening.date + datetime.timedelta(days=1)
                screening.occupied_seats = ""
                screening.save()

                self.stdout.write(self.style.SUCCESS('Successfully added one day to "%s"' % screening.show))
            if screenings.count() == 0:
                self.stdout.write(self.style.SUCCESS('No screenings to affect'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to add days to screenings'))
        

        try:
            movies = Movie.objects.filter(tickets_sale_date__isnull=True);
            for movie in movies:
                movie.date = movie.release_date + datetime.timedelta(days=1)
                movie.save()

                self.stdout.write(self.style.SUCCESS('Successfully added one day to release date to "%s"' % movie.name))

            if movies.count() == 0:
                self.stdout.write(self.style.SUCCESS('No movies to push release date'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to add days to release dates'))

        try:
            User.objects.filter(is_staff=False).delete()
            self.stdout.write(self.style.SUCCESS('Successfully removed all users'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to remove all users'))

        
        try:
            Ticket.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Successfully removed all tickets'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to remove all tickets'))

        try:
            Membership.objects.filter(user__is_staff=False).delete()
            self.stdout.write(self.style.SUCCESS('Successfully removed all memberships'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to remove all memberships'))
        
        try:
            CustomDetails.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Successfully removed all custom details'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to remove all custom details'))
        
        return
