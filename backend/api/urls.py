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
    # sEarch function for patient
    path('patients/search', views.search_patients, name='search_billings'),



    #User Logs
    path('userlogs', views.get_user_logs, name='user_userlog'),


    #billing
    path('billings/add', views.create_billing, name='create_billing'),
    path('billings/update/<int:pk>', views.update_billing, name='update_billing'),
    
    path('service/search', views.search_service, name='search_service'),


    path('billings/list', views.get_bills, name='billing_list'),
    path('billings/list/v2', views.get_bills_with_bill_items, name='billing_list'),
    path('billings/id/<str:pk>', views.get_bills_by_id_with_bill_items, name='billing_by_id'),

                                #id of that BILLING
    path('billings/add-billing-item/<int:pk>', views.create_bill_item, name='create_billing_item'),

                          #code not id..  
    path('billings/<str:billing_pk>/items/<str:item_pk>/edit', views.edit_bill_item, name='edit_bill_item'),

    path('billings/<str:billing_pk>/items/<str:item_pk>/get', views.get_bill_item, name='get_bill_item'),



    #GET /api/billings/search?q=john
    path('billings/search', views.search_billings, name='search_billings'),
    


    
    #Billing_Items
    path('billing_item/id/<str:pk>', views.get_billing_item, name='get_billing_item'),



    #LAB RESULTS
    path('laboratory/add-patient-laboratory/patient-id/<str:pk>', views.create_laboratory_result_for_patient, name='create_laboratory_result_for_patient'),

    path('laboratory/search-patient-laboratory/patient-id/<str:pk>', views.create_laboratory_result_for_patient, name='create_laboratory_result_for_patient'),

    path('laboratory/upload-file-laboratory/laboratory-id/<str:pk>', views.create_laboratory_file_result_for_laboratory_class, name='create_laboratory_file_result_for_laboratory_class'),




]   
