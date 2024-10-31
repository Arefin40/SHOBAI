import requests
from django.core.files.base import ContentFile
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

User = get_user_model()


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        data = sociallogin.account.extra_data

        user.email = data.get("email", "")
        user.name = data.get("name", "")

        picture_url = data.get("picture", None)
        if picture_url:
            response = requests.get(picture_url)
            if response.status_code == 200:
                file_name = f"{user.name}_profile.jpg"
                user.image.save(file_name, ContentFile(response.content), save=False)
            else:
                user.image = "profiles/user_placeholder.png"
        else:
            user.image = "profiles/user_placeholder.png"

        user.save()
        return user
