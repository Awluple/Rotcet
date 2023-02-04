from django.core.management.base import BaseCommand, CommandError
from screenings.models import Screening
import datetime

class Command(BaseCommand):
    help = 'Adds days to screenings\' dates'

    def add_arguments(self, parser):
        parser.add_argument('days', type=int)

    def handle(self, *args, **options):
        days = options['days'];
        try:
            screenings = Screening.objects.all();
            for screening in screenings:
                screening.date = screening.date + datetime.timedelta(days=days)
                screening.occupied_seats = ""
                screening.save()

                self.stdout.write(self.style.SUCCESS(f'Successfully added {days} days to "{screening.show}"'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to add days to screenings'))

        return