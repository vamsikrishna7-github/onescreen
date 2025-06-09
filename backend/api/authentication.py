from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # Try to fetch the user by username
            user = UserModel.objects.get(username=username)
        except UserModel.DoesNotExist:
            try:
                # If username fails, try email
                user = UserModel.objects.get(email=username)
            except UserModel.DoesNotExist:
                return None
        
        if user.check_password(password):
            return user
        return None 