# custom_app/urls.py

from django.urls import path
from . import views
from .views import GroupListCreateView, GroupPermissionUpdateView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

#api/
urlpatterns = [

    path('server-time', views.get_server_time, name='server-init-time'),

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
    path('patients/<int:pk>/history', views.patient_history, name='patient-history'),
    path('patients/deactivate/<int:pk>', views.patient_deactivate, name='patient_deactivate'),
    # sEarch function for patient
    path('patients/search', views.search_patients, name='search_billings'),
    path('users/search', views.search_users, name='search_users'),




    #User Logs
    path('userlogs', views.get_user_logs, name='user_userlog'),


    #billing
    path('billings/add', views.create_billing, name='create_billing'),
    path('billings/update/<int:pk>', views.update_billing, name='update_billing'),
    
    path('service/search', views.search_service, name='search_service'),


    path('billings/list', views.get_bills, name='billing_list'),
    path('billings/list/v2', views.get_bills_with_bill_items, name='billing_list'),
    path('billings/id/<str:pk>', views.get_bills_by_id_with_bill_items, name='billing_by_id'), #THIS IS CODE!!
    path('billings/actualid/<str:pk>', views.get_bills_by_ACTUAL_id_with_bill_items, name='billing_by_actual_id'),


                                #id of that BILLING
    path('billings/add-billing-item/<int:pk>', views.create_bill_item, name='create_billing_item'),

                          #code not id..  
    path('billings/<str:billing_pk>/items/<str:item_pk>/edit', views.edit_bill_item, name='edit_bill_item'),

    path('billings/<str:billing_pk>/items/<str:item_pk>/get', views.get_bill_item, name='get_bill_item'),
    path('billings/<int:billing_id>/mark-paid/', views.mark_billing_paid, name='mark_billing_paid'),


    #GET /api/billings/search?q=john
    path('billings/search', views.search_billings, name='search_billings'),
    


    
    #Billing_Items
    path('billing_item/id/<str:pk>', views.get_billing_item, name='get_billing_item'),



    #LAB RESULTS
    path('laboratory/add-patient-laboratory/patient-id/<str:pk>', views.create_laboratory_result_for_patient, name='create_laboratory_result_for_patient'),
    #TODO: finish this today the seach lab
    path('laboratory/search-laboratory', views.search_labId, name='search_labId'),


    path('laboratory/files/group/<int:labId>', views.create_laboratory_file_group, name='create-lab-file-group'),

    path('laboratory/files/group/<int:group_id>/', views.get_laboratory_file_group, name='get-lab-file-group'),

    #IMAGE UPLOAD
    path('user/<int:user_id>/upload-image', views.upload_user_image, name='upload_user_image'),


    #DEPRECATED
    path('laboratory/upload-file-laboratory/laboratory-id/<str:pk>', views.create_laboratory_file_result_for_laboratory_class, name='create_laboratory_file_result_for_laboratory_class'),
    #DEPRECATED
    path('laboratory/get-laboratory/<str:pk>', views.get_laboratory_by_id, name='get_laboratory_by_id'),



    # fetching bed and room info
    path('room_bed_list', views.room_bed_list, name='assign_bed_to_billing'),




    # Bed Assignment
    path('assign-bed/<int:patient_id>/<int:bed_id>/<int:billing_id>', views.assign_bed, name='assign_bed_to_billing'),

    
    path('discharge-patient/<int:patient_id>', views.discharge_patient, name='discharge_patient'),
    path('bed-assignments/', views.bed_assignment_list, name='bed_assignment_list'),





    # Group management
    path('groups/', GroupListCreateView.as_view(), name='group-list-create'),
    path('groups/<int:group_id>/permissions/', GroupPermissionUpdateView.as_view(), name='group-permission-update'),
    
    # # Optional: List all permissions
    # path('permissions/', views.list_permissions, name='list_permissions'),
    # User Management Endpoints
    path('users/list', views.user_list, name='user_list'),
    path('users/<int:pk>', views.user_detail, name='user_detail'),
    path('users/roles', views.user_roles, name='user_roles'),

]   
