from django.urls import path
from .views import RegisterView, CreateOrUpdateProfessionalProfileView, view_profile , ProfessionalDetailView, ProfessionalProfileUpdateView, MyProfessionalProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import SearchProfessionalsView , ReviewCreateView, RevealPhoneNumberView , ProfessionalReviewsView
from . import admin_views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/create-or-update/', CreateOrUpdateProfessionalProfileView.as_view(), name='create-update-profile'),
    path('profile/<str:username>/', view_profile, name='view-profile'),
    path('search/', SearchProfessionalsView.as_view(), name='search_professionals'),
    path('reviews/', ReviewCreateView.as_view(), name='create-review'),
    path('reviews/<int:professional_id>/', ProfessionalReviewsView.as_view(), name='professional-reviews'),
    path('reveal-contact/<int:professional_id>/', RevealPhoneNumberView.as_view(), name='reveal-contact'),
    path('professionals/<int:id>/', ProfessionalDetailView.as_view(), name='professional-detail'),
    path('profile/update/', ProfessionalProfileUpdateView.as_view(), name='profile-update'),
    path('professionals/me/', MyProfessionalProfileView.as_view(), name='my-profile'),


    # admin

    path('admin/users/', admin_views.AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/approve/<int:user_id>/', admin_views.ApproveProfessionalView.as_view(), name='admin_approve'),
    path('admin/disapprove/<int:user_id>/', admin_views.DisapproveProfessionalView.as_view(), name='admin_disapprove'),
    path('admin/ban/<int:user_id>/', admin_views.BanUserView.as_view(), name='admin_ban_user'),
    path('admin/stats/', admin_views.SiteStatsView.as_view(), name='admin_stats'),
]
