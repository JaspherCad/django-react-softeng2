# custom_app/urls.py

from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

#api/
urlpatterns = [
    path('about', views.about, name='aboutss'),
    
    path('user/register', views.CreateUserView.as_view(), name='register'),
    path('user/login', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh', TokenRefreshView.as_view(), name='refresh'),
    path('protected', views.protected_view, name='test-protected-view'),
    path('doctor', views.doctorOnly, name='test-doctor-view'),

    path('auth/check', views.auth_check, name='test-doctor-view'),


    # CRUD FOR PATIENTS
    path('patients/list', views.patient_list, name='patient_list'),
    path('patients/create', views.patient_create, name='patient_create'),
    path('patients/<int:pk>', views.patient_details, name='patient_get_specific'),
    path('patients/update/<int:pk>', views.patient_update, name='patient_update'),
    path('patients/deactivate/<int:pk>', views.patient_deactivate, name='patient_deactivate'),



    #User Logs
    path('userlogs', views.get_user_logs, name='user_userlog'),


    #billing
    path('billings/add', views.create_billing, name='create_billing'),
    path('billings/update/<int:pk>', views.update_billing, name='update_billing'),
    


    path('billings/list', views.get_bills, name='billing_list'),
    path('billings/list/v2', views.get_bills_with_bill_items, name='billing_list'),
    path('billings/id/<str:pk>', views.get_bills_by_id_with_bill_items, name='billing_by_id'),

    path('billings/add-billing-item/<int:pk>', views.create_bill_item, name='create_billing_item'),
    #GET /api/billings/search?q=john
    path('billings/search', views.search_billings, name='search_billings'),


]   
