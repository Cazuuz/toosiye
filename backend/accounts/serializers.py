from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Review, ProfessionalProfile


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role', 'profile_image']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            profile_image=validated_data.get('profile_image')
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")


class ProfessionalProfileSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = ProfessionalProfile
        fields = [
            'id', 'user', 'full_name','email', 'profession', 'phone_number', 'city', 'zone',
            'experience_years', 'services', 'about', 'whatsapp_link',
            'average_rating', 'total_reviews', 'profile_image', 'created_at'
        ]
        read_only_fields = ['user', 'average_rating', 'total_reviews', 'created_at']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return round(sum([r.rating for r in reviews]) / reviews.count(), 1)
        return None

    def get_total_reviews(self, obj):
        return obj.reviews.count()

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Don't allow user field to be updated
        validated_data['user'] = instance.user
        return super().update(instance, validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source='reviewer.username')

    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'professional', 'rating', 'comment', 'created_at']
