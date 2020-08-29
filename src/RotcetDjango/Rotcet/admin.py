from django.contrib import admin

from django import forms
from django.contrib.auth import authenticate

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class EmailAuthenticationForm(forms.Form):
    """
    Converted AuthenticationForm to accept e-mail instead of username.
    For more detailed information go to django.contrib.auth.forms
    """

    email = forms.EmailField(max_length=150, widget=forms.TextInput())
    password = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'current-password'}),
    )

    error_messages = {
        'invalid_login': _(
            "Please enter a correct email and password. Note that both "
            "fields may be case-sensitive."
        ),
        'inactive': _("This account is inactive."),
    }

    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        self.user_cache = None
        super().__init__(*args, **kwargs)
    
    def confirm_login_allowed(self, user):
        if not user.is_active:
            raise ValidationError(
                self.error_messages['inactive'],
                code='inactive',
            )

    def clean(self):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')

        if email is not None and password:
            self.user_cache = authenticate(self.request, email=email, password=password)
            if self.user_cache is None:
                raise self.get_invalid_login_error()
            else:
                self.confirm_login_allowed(self.user_cache)
    
    def get_user(self):
        return self.user_cache
    
    def get_invalid_login_error(self):
        return ValidationError(
            self.error_messages['invalid_login'],
            code='invalid_login',
        )

class RotcetAdminSite(admin.AdminSite):
    site_header = 'Rotcet Cinema administration'
    site_title = 'Rotcet Cinema site admin'
    login_form = EmailAuthenticationForm
    login_template = 'admin/customLogin.html'