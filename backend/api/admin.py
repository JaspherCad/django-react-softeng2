from django.contrib import admin
from .models import BillingItem, UserImage
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import (
    User, Patient, MedicalHistory, Service, PatientService,
    Billing, LaboratoryResult, LabResultFile, ClinicalNote, UserLog, Payment, LabResultFileInGroup, LabResultFileGroup, Room, BedAssignment, Bed, User, PatientImage
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
admin.site.register(UserImage)

admin.site.register(Room)
admin.site.register(Bed)
admin.site.register(BedAssignment)

admin.site.register(PatientImage)






@admin.register(BillingItem)
class BillingItemAdmin(admin.ModelAdmin):
    list_display = ('billing', 'service_availed', 'quantity', 'subtotal')

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('user_id', 'role', 'department')

    def save(self, commit=True):
        # Use your CustomUserManager.create_user()
        user = self._meta.model.objects.create_user(
            user_id=self.cleaned_data['user_id'],
            password=self.cleaned_data['password1'],
            role=self.cleaned_data['role'],
            department=self.cleaned_data['department'],
            is_active=self.cleaned_data.get('is_active', True),
            is_staff=self.cleaned_data.get('is_staff', False)
        )
        return user


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'


class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ('user_id', 'role', 'department', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('user_id', 'password')}),
        ('Personal Info', {'fields': ('role', 'department')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('user_id', 'password1', 'password2', 'role', 'department', 'is_staff', 'is_active'),
        }),
    )

    # Use your CustomUserManager.save() to ensure group assignment
    def save_model(self, request, obj, form, change):
        if not change:  # Creating new user
            obj.set_password(obj.password)  # Hash password
        else:  # Updating user
            if 'password' in form.changed_data:
                obj.set_password(obj.password)  # Hash password if changed
        super().save_model(request, obj, form, change)

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