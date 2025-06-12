from django.contrib import admin
from .models import BillingItem

from .models import (
    User, Patient, MedicalHistory, Service, PatientService,
    Billing, LaboratoryResult, LabResultFile, ClinicalNote, UserLog, Payment, LabResultFileInGroup, LabResultFileGroup
)

admin.site.register(User)
admin.site.register(Patient)
admin.site.register(MedicalHistory)
admin.site.register(Service)
admin.site.register(PatientService)
admin.site.register(Billing)
admin.site.register(LaboratoryResult)
admin.site.register(LabResultFile)
admin.site.register(ClinicalNote)
admin.site.register(UserLog)
admin.site.register(Payment)
admin.site.register(LabResultFileGroup)
admin.site.register(LabResultFileInGroup)




@admin.register(BillingItem)
class BillingItemAdmin(admin.ModelAdmin):
    list_display = ('billing', 'service_availed', 'quantity', 'subtotal')



#     admin.add_logentry
# admin.change_logentry
# admin.delete_logentry
# admin.view_logentry
# api.add_billing
# api.change_billing
# api.delete_billing
# api.view_billing
# api.add_billingitem
# api.change_billingitem
# api.delete_billingitem
# api.view_billingitem
# api.add_clinicalnote
# api.change_clinicalnote
# api.delete_clinicalnote
# api.view_clinicalnote
# api.add_laboratoryresult
# api.change_laboratoryresult
# api.delete_laboratoryresult
# api.view_laboratoryresult
# api.add_labresultfile
# api.change_labresultfile
# api.delete_labresultfile
# api.view_labresultfile
# api.add_medicalhistory
# api.change_medicalhistory
# api.delete_medicalhistory
# api.view_medicalhistory
# api.add_patient
# api.change_patient
# api.delete_patient
# api.view_patient
# api.add_patientservice
# api.change_patientservice
# api.delete_patientservice
# api.view_patientservice
# api.add_payment
# api.change_payment
# api.delete_payment
# api.view_payment
# api.add_service
# api.change_service
# api.delete_service
# api.view_service
# api.add_user
# api.change_user
# api.delete_user
# api.view_user
# api.add_userlog
# api.change_userlog
# api.delete_userlog
# api.view_userlog
# auth.add_group
# auth.change_group
# auth.delete_group
# auth.view_group
# auth.add_permission
# auth.change_permission
# auth.delete_permission
# auth.view_permission
# contenttypes.add_contenttype
# contenttypes.change_contenttype
# contenttypes.delete_contenttype
# contenttypes.view_contenttype
# sessions.add_session
# sessions.change_session
# sessions.delete_session
# sessions.view_session