from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.generics import RetrieveAPIView
from django.contrib.auth import login
from .serializers import UserRegistrationSerializer, UserLoginSerializer,ProfessionalProfileSerializer, ReviewSerializer
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import ProfessionalProfile , Review, ContactView
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from django.db import IntegrityError


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return Response({'message': 'Login successful'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=200)

class ProtectedExampleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You are authenticated!"})



class CreateOrUpdateProfessionalProfileView(generics.CreateAPIView):
    serializer_class = ProfessionalProfileSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.role not in ['professional', 'both',]:
            return Response({"detail": "Only professionals can create a profile."}, status=status.HTTP_403_FORBIDDEN)

        # Check if profile exists
        try:
            profile = user.profile  # OneToOneField: reverse access
            serializer = self.serializer_class(profile, data=request.data)
        except ProfessionalProfile.DoesNotExist:
            serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def view_profile(request, username):
    try:
        profile = ProfessionalProfile.objects.get(user__username=username)
        serializer = ProfessionalProfileSerializer(profile)
        return Response(serializer.data)
    except ProfessionalProfile.DoesNotExist:
        return Response({'detail': 'Profile not found'}, status=404)


class SearchProfessionalsView(generics.ListAPIView):
    serializer_class = ProfessionalProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = ProfessionalProfile.objects.all()
        q = self.request.query_params.get('q')

        if q:
            queryset = queryset.filter(
                Q(full_name__icontains=q) |
                Q(profession__icontains=q) |
                Q(city__icontains=q) |
                Q(zone__icontains=q) |
                Q(services__icontains=q) |
                Q(about__icontains=q)
            )

        return queryset.order_by('-created_at')


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)


class ProfessionalReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        professional_id = self.kwargs['professional_id']
        return Review.objects.filter(professional_id=professional_id).order_by('-created_at')


class RevealPhoneNumberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, professional_id):
        try:
            professional = ProfessionalProfile.objects.get(id=professional_id)
        except ProfessionalProfile.DoesNotExist:
            return Response({"detail": "Professional not found"}, status=404)

        if professional.user == request.user:
            return Response({"detail": "You cannot reveal your own number."}, status=400)

        # Log the view
        ContactView.objects.create(user=request.user, professional=professional)

        return Response({
            "phone_number": professional.phone_number
        }, status=200)


class ProfessionalDetailView(RetrieveAPIView):
    queryset = ProfessionalProfile.objects.all()
    serializer_class = ProfessionalProfileSerializer
    lookup_field = 'id'


class ProfessionalProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfessionalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProfessionalProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return ProfessionalProfile.objects.get(user=self.request.user)

class MyProfessionalProfileView(RetrieveAPIView):
    serializer_class = ProfessionalProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return ProfessionalProfile.objects.get(user=self.request.user)


class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"detail": "Unauthorized"}, status=403)

        users = User.objects.all().values("id", "username", "role", "is_active")
        user_list = []
        for u in users:
            status = "Active" if u["is_active"] else "Banned"
            user_list.append({**u, "status": status})
        return Response(user_list)


class ApproveProfessionalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not request.user.is_staff:
            return Response({"detail": "Unauthorized"}, status=403)

        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
            profile.is_approved = True
            profile.save()
            return Response({"detail": "Professional approved."})
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)


class DisapproveProfessionalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not request.user.is_staff:
            return Response({"detail": "Unauthorized"}, status=403)

        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
            profile.is_approved = False
            profile.save()
            return Response({"detail": "Professional disapproved."})
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)


class BanUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not request.user.is_staff:
            return Response({"detail": "Unauthorized"}, status=403)

        try:
            user = User.objects.get(id=user_id)
            user.is_active = False
            user.save()
            return Response({"detail": "User banned successfully."})
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)


class SiteStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"detail": "Unauthorized"}, status=403)

        data = {
            "Total Users": User.objects.count(),
            "Active Users": User.objects.filter(is_active=True).count(),
            "Banned Users": User.objects.filter(is_active=False).count(),
            "Professionals": ProfessionalProfile.objects.count(),
            "Reviews": Review.objects.count(),
        }
        return Response(data)
