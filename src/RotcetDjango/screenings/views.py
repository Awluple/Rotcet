import datetime
from django.http import JsonResponse
 
def get_server_time(self):
    return JsonResponse({'time':datetime.datetime.now()})