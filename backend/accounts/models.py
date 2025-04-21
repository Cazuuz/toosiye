from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('professional', 'Professional'),
        ('both', 'Both'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    is_banned = models.BooleanField(default=False)
    def __str__(self):
        return self.username

class ProfessionalProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, default='')
    
    profession = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    city = models.CharField(max_length=50)
    zone = models.CharField(max_length=50)
    experience_years = models.PositiveIntegerField()
    services = models.CharField(max_length=300)  # comma-separated tags
    about = models.TextField()
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    portfolio_1 = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    portfolio_2 = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    portfolio_3 = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    portfolio_4 = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    portfolio_5 = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    whatsapp_link = models.URLField(blank=True, null=True)
    telegram_link = models.URLField(blank=True, null=True)
    facebook_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.full_name} - {self.profession}"

class Review(models.Model):
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    professional = models.ForeignKey('ProfessionalProfile', related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # class Meta:
        # unique_together = ('reviewer', 'professional')

    def __str__(self):
        return f"Review by {self.reviewer.username} on {self.professional.user.username}"


class ContactView(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # The viewer
    professional = models.ForeignKey(ProfessionalProfile, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} viewed {self.professional.user.username}'s contact"
