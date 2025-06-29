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


    # User Management
    path('users', views.user_list, name='user-list'),
    path('groups', views.role_group_list, name='role-group-list'),
    path('users/<int:user_id>/assign-roles', views.update_user_groups, name='user-role-assign'),


    # Password Recovery
    path('forgot-password', views.forgot_password, name='forgot_password'),
    path('verify-answers', views.verify_security_answers, name='verify_answers'),
    path('reset-password', views.reset_password, name='reset_password'),
    path('set-security-questions', views.set_security_questions, name='set_security_questions'),



    path('auth/check', views.auth_check, name='test-doctor-view'),


    # CRUD FOR PATIENTS 
    path('patients/list', views.patient_list, name='patient_list'),
    path('patients/create', views.patient_create, name='patient_create'),
    path('patients/<int:pk>', views.patient_details, name='patient_get_specific'),

    #two types of update

    #1. update patient details JUST BASIC PATIENT UPDATE and not changing casecode
    path('patients/update/<int:pk>', views.patient_update, name='patient_update'),

    #2. update patient case number MEANING NEW INSTANCE ITO
    path('patients/update_new_casecode/<int:pk>', views.patient_update_new_case_number, name='patient_update'),

    path('patients/<int:pk>/history', views.patient_history, name='patient-history'),
    path('patients/<int:pk>/history/id/<int:historyId>', views.patient_history_byId, name='patient-history'),
    path('patients/report/', views.generate_report, name='generate_report'),

    #archiving patients 
    #await axios.post(`/api/patients/${patientId}/archive/`, { archive: true });
    path('patients/<int:pk>/archive/', views.archive_patient, name='patient-archive'),
    #{ "id": 42, "unarchive": true }

    path('patients/archived/', views.archived_patients, name='archived-patient-list'),




    path('patients/deactivate/<int:pk>', views.patient_deactivate, name='patient_deactivate'),


    # sEarch function for patient
    path('patients/search', views.search_patients, name='search_patients'),

    path('patients_that_are_not_discharged/search', views.search_patients_that_are_not_discharged, name='search_patients_that_are_not_discharged'),
    
    path('patients_admitted_only/search', views.search_patients_admitted_only, name='search_patients_admitted_only'),




    path('users/search', views.search_users, name='search_users'),
    path('patient-image-upload', views.patientImageupload, name='patient-image-upload'),
    path('patient-images/<int:patient_id>', views.get_patient_images, name='get_patient_images'),




    #User Logs
    path('userlogs/', views.get_user_logs, name='user_userlog'),
    path('userlogs/<int:pk>/', views.get_user_logs_by_id, name='user_userlog_by_id'),
    path('userlogs/all', views.get_user_logs_all, name='user_userlog_all'),



    #billing
    path('billings/add', views.create_billing, name='create_billing'),
    path('billings/update/<int:pk>', views.update_billing, name='update_billing'),
    
    path('service/search', views.search_service, name='search_service'),


    path('billings/list', views.get_bills, name='billing_list'),
    path('billings/list/v2', views.get_bills_with_bill_items, name='billing_list'),

    path('billings/id/<str:pk>', views.get_bills_by_id_with_bill_items, name='billing_by_id'), #THIS IS CODE!!
    path('billings/actualid/<str:pk>', views.get_bills_by_ACTUAL_id_with_bill_items, name='billing_by_actual_id'),

    #get patient's billings
    path('billings/patient/<int:patient_id>', views.get_bills_by_patient, name='billing_by_patient'),

    


                                #id of that BILLING
    path('billings/add-billing-item/<int:pk>', views.create_bill_item, name='create_billing_item'),

                          #code not id..  
    path('billings/<str:billing_pk>/items/<str:item_pk>/edit', views.edit_bill_item, name='edit_bill_item'),

    path('billings/<str:billing_pk>/items/<str:item_pk>/get', views.get_bill_item, name='get_bill_item'),
    path('billings/<str:billing_code>/mark-paid', views.mark_billing_paid, name='mark_billing_paid'),


    #GET /api/billings/search?q=john
    path('billings/search', views.search_billings, name='search_billings'),

    path('billings_admittedOnly/search', views.search_billings_admitted_only, name='search_billings'),

    path('billings_exclud_discharged/search', views.search_billings_exclud_discharged, name='search_billings'),

    
#search_billings_exclud_discharged

    
    #Billing_Items
    path('billing_item/id/<str:pk>', views.get_billing_item, name='get_billing_item'),



    #LAB RESULTS
    path('laboratory/add-patient-laboratory/patient-id/<str:pk>', views.create_laboratory_result_for_patient, name='create_laboratory_result_for_patient'),
    #TODO: finish this today the seach lab save state
    path('laboratory/search-laboratory', views.search_labId, name='search_labId'),

#SAVE STATE 
    path('laboratory/files/group/<int:labId>', views.create_laboratory_file_group, name='create-lab-file-group'),

    path('laboratory/files/group/<int:group_id>/', views.get_laboratory_file_group, name='get-lab-file-group'),

    #IMAGE UPLOAD
    path('user/<int:user_id>/upload-image/', views.upload_user_image, name='upload_user_image'),


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


    #NOTES
    path('notes/<str:case_number>', views.get_patient_history_by_case, name='get_notes_by_code'),
    
    path('notes/all-notes-patientid/<int:patient_id>', views.get_clinical_notes_by_patient, name='get_notes_by_patient'),

    #LOGIC, existing na kasi si case number before we put here...







    #dashboards
    path('dashboard/dashboard_totals', views.dashboard_totals, name='dashboard_totals'),







    #step 1:
    # http://147:8000/api/patients/1/notes/4678NEW/create

# {
#   "author": 1,
#   "note_type": "Doctor",
#   "note_date": "2025-06-18T07:30:00Z",
#   "focus_problem": "22222 HAHAHA",
#   "progress_notes": "No swelling, dressing changed",
#   "orders": "Monitor site q2h",
#   "content": "Patient resting comfortably.",
#   "medication": "",
#   "dose_frequency": ""
# }

    #step 2: fetch http://172.3dsad0.8.147:8000/api/notes/history/4678NEW


    #WORKING! 1
    path('patients/<int:pk>/notes/<str:case_number>/create', views.create_clinical_note, name='create_clinical_note'),


    #WORKING! 2
    path('notes/history/<str:case_number>', views.get_clinical_notes_by_case_number, name='get_clinical_notes_by_case_number'),



    #BACKUp
    path('backup/history/', views.get_backup_history, name='backup_history'),
    path('backup/restore/<int:backup_id>/', views.trigger_restore, name='trigger_restore'),
    path('backup/', views.trigger_backup, name='trigger_backup'),


]   
