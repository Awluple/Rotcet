from django.core.management.base import BaseCommand, CommandError
from screenings.models import Screening
from informations.models import News
import datetime
from django.utils import timezone

class Command(BaseCommand):
    help = 'Pushes back days to screenings\' dates'

    def add_arguments(self, parser):
        parser.add_argument('days', type=int)

    def handle(self, *args, **options):
        days = options['days'];
        self.stdout.write(self.style.SUCCESS('-------------SCREENINGS-------------'))
        try:
            screenings = Screening.objects.all();
            for screening in screenings:
                new_date =  screening.date + datetime.timedelta(days=-days)
                if new_date < timezone.now() and not screening.date < timezone.now():
                    self.stdout.write(self.style.WARNING(f'New date of {screening.show} is now lower than the current datetime'))
                screening.date = screening.date + datetime.timedelta(days=-days)
                screening.occupied_seats = ""
                screening.save()

                self.stdout.write(self.style.SUCCESS(f'Successfully pushed back {days} days to "{screening.show}"'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to push back days to Screenings'))

        self.stdout.write(self.style.SUCCESS('-------------NEWS-------------'))
        try:
            news = News.objects.all();
            for article in news:
                article.day_posted = article.day_posted + datetime.timedelta(days=-days)
                article.save()

                self.stdout.write(self.style.SUCCESS(f'Successfully added {days} days to "{article}"'))
        except Exception as ex:
            print(ex)
            self.stdout.write(self.style.ERROR('Error when trying to add days to News'))

        return