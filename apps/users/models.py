from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager


# ===================================
# User Model
# ===================================
class UserManager(BaseUserManager):
    def create_user(self, name, email, password=None, **extra_fields):
        if not email:
            raise ValueError("A valid email address is required.")
        email = self.normalize_email(email)
        user = self.model(name=name, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "Admin")
        return self.create_user(name, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    image = models.ImageField(
        upload_to="profiles",
        null=True,
        blank=True,
        default="profiles/user_placeholder.png",
    )
    role = models.CharField(
        max_length=10,
        choices=[("ADMIN", "Admin"), ("USER", "User"), ("MERCHANT", "Merchant")],
        default="USER",
    )
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]
    objects = UserManager()

    def __str__(self):
        return f"{self.name} - {self.email}"

    def has_perm(self, perm, obj=None):
        if self.is_superuser:
            return True
        return False

    def has_module_perms(self, app_label):
        if self.is_superuser:
            return True
        return False

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"


# ===================================
# Merchant Application
# ===================================
class MerchantApplication(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nid = models.CharField(max_length=20)
    photo = models.ImageField(upload_to="merchant_photos/")
    email = models.EmailField()
    contact = models.CharField(max_length=20)
    date_applied = models.DateTimeField(auto_now_add=True)
    comments = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=[("PENDING", "Pending"), ("APPROVED", "Approved"), ("REJECTED", "Rejected")],
        default="PENDING",
    )

    class Meta:
        db_table = "merchant_applications"
        verbose_name = "Merchant Application"
        verbose_name_plural = "Merchant Applications"
        ordering = ["-date_applied"]

    def __str__(self):
        return f"{self.email} - {self.status}"