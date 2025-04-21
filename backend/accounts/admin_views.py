from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from .models import CustomUser, ProfessionalProfile, Review
from .serializers import UserRegistrationSerializer, ProfessionalProfileSerializer
from django.db.models import Avg

class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.all()
        data = [{
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active
        } for user in users]
        return Response(data)


class ApproveProfessionalView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            profile = ProfessionalProfile.objects.get(user__id=user_id)
            profile.user.is_active = True
            profile.user.save()
            return Response({"message": "Professional approved."})
        except ProfessionalProfile.DoesNotExist:
            return Response({"detail": "Professional not found."}, status=404)


class DisapproveProfessionalView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            profile = ProfessionalProfile.objects.get(user__id=user_id)
            profile.user.is_active = False
            profile.user.save()
            return Response({"message": "Professional disapproved."})
        except ProfessionalProfile.DoesNotExist:
            return Response({"detail": "Professional not found."}, status=404)


class BanUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            user.is_active = False
            user.save()
            return Response({"message": "User account has been banned."})
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)


class SiteStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = CustomUser.objects.count()
        total_professionals = ProfessionalProfile.objects.count()

        top_rated = ProfessionalProfile.objects.annotate(
            average_rating=Avg('reviews__rating')
        ).order_by('-average_rating')[:5]

        stats = {
            "total_users": total_users,
            "total_professionals": total_professionals,
            "top_rated": [
                {
                    "id": p.id,
                    "name": p.full_name,
                    "rating": round(p.average_rating, 2) if p.average_rating else None
                }
                for p in top_rated
            ],
            # Add most_viewed if needed later
        }
        return Response(stats)

