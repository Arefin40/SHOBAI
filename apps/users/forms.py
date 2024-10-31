from django import forms
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.password_validation import password_validators_help_texts

User = get_user_model()


class UserRegistrationForm(forms.ModelForm):
    fname = forms.CharField(
        label="First Name",
        widget=forms.TextInput(
            attrs={
                "class": "input w-full",
                "placeholder": "Enter your first name",
                "autocomplete": "given-name",
            }
        ),
        required=True,
        error_messages={"required": "First name is required."},
    )
    lname = forms.CharField(
        label="Last Name",
        widget=forms.TextInput(
            attrs={
                "class": "input w-full",
                "placeholder": "Enter your last name",
                "autocomplete": "family-name",
            }
        ),
        required=True,
        error_messages={"required": "Last name is required."},
    )
    email = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(
            attrs={
                "class": "input w-full",
                "placeholder": "Enter your email",
                "autocomplete": "email",
            }
        ),
        required=True,
        error_messages={"required": "Email is required."},
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(
            attrs={
                "class": "password-field pr-10 w-full",
                "placeholder": "Enter a password",
            }
        ),
        required=True,
        error_messages={"required": "Password is required."},
        help_text=password_validators_help_texts(),
    )
    confirm_password = forms.CharField(
        label="Confirm Password",
        widget=forms.PasswordInput(
            attrs={
                "class": "password-field pr-10 w-full",
                "placeholder": "Enter the password again",
            }
        ),
        required=True,
        error_messages={"required": "Confirm password is required."},
    )

    class Meta:
        model = User
        fields = ["fname", "lname", "email", "password", "confirm_password"]

    def clean_email(self):
        email = self.cleaned_data.get("email")
        validate_email(email)
        return email

    def clean_password(self):
        password = self.cleaned_data.get("password")
        validate_password(password)
        return password

    def clean_confirm_password(self):
        password = self.cleaned_data.get("password")
        confirm_password = self.cleaned_data.get("confirm_password")
        if password and confirm_password and password != confirm_password:
            raise ValidationError("Passwords do not match.")
        return confirm_password

    def save(self, commit=True):
        user = super(UserRegistrationForm, self).save(commit=False)
        user.name = f"{self.cleaned_data.get('fname')} {self.cleaned_data.get('lname')}"
        user.set_password(self.cleaned_data.get("password"))
        if commit:
            user.save()
        return user


class UserSignInForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                "class": "input w-full pl-10",
                "placeholder": "Enter email",
                "autocomplete": "email",
            }
        ),
        required=True,
        error_messages={"required": "Email is required."},
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "password-field w-full px-10",
                "placeholder": "Enter password",
            }
        ),
        required=True,
        error_messages={"required": "Password is required."},
    )
