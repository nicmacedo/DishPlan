from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        if not getattr(user, "nome", None):
            name = data.get("name") or f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
            user.nome = name or user.email.split("@")[0]
        return user
