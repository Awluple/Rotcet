from django.contrib import admin
from .models import Ticket, Membership, UserDetails, CustomDetails

class TicketAdmin(admin.ModelAdmin):
    actions=['really_delete_selected']

    def get_actions(self, request):
        actions = super(TicketAdmin, self).get_actions(request)
        del actions['delete_selected']
        return actions

    def really_delete_selected(self, request, queryset):
        # delete ticket from a screening's occupied_seats
        for obj in queryset:
            obj.delete()

        if queryset.count() == 1:
            message_bit = "1 ticket entry was"
        else:
            message_bit = "%s ticket entries were" % queryset.count()
        self.message_user(request, "%s successfully deleted." % message_bit)
    really_delete_selected.short_description = "Delete selected entries"


admin.site.register(Ticket, TicketAdmin)
admin.site.register(Membership)
admin.site.register(UserDetails)
admin.site.register(CustomDetails)