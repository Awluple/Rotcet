from django.core.management.base import BaseCommand, CommandError
from screenings.models import Screening
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
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to add days to dates'))
        
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
