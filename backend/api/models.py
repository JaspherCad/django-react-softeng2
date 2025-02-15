from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.core.validators import MinValueValidator

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, user_id, password=None, **extra_fields):
        if not user_id:
            raise ValueError("User ID is required")
        user = self.model(user_id=user_id, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, user_id, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(user_id, password, **extra_fields)

# Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Doctor', 'Doctor'),
        ('Nurse', 'Nurse'),
        ('Teller', 'Teller'),
        ('Receptionist', 'Receptionist')
    ]
    #by default, user has username, i think, but password1 and passwrod2 are sure etc
    user_id = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    department = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) #has access to admin site, in short ito ay admin
    
    # Removed security Q&A due to security concerns - use password reset instead
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'user_id'
    #USERNAME_FIELD = 'user_id' so if i said this, then the username field is changed to user_id?
    REQUIRED_FIELDS = ['role', 'department']

    def __str__(self):
        return self.user_id

    def save(self, *args, **kwargs):
        """Automatically add to appropriate group based on role"""
        super().save(*args, **kwargs)
        group, _ = Group.objects.get_or_create(name=self.role)
        self.groups.add(group)

















# Patient Model
#NOTE!! DO NOT DELETE PATIENTS!
class Patient(models.Model):
    STATUS_CHOICES = [
        ('Admitted', 'Admitted'),
        ('Discharged', 'Discharged'),
        ('Outpatient', 'Outpatient')
    ]
    IS_ACTIVE_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Deleted', 'Deleted'),
    ]

    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    address = models.CharField(max_length=255)
    admission_date = models.DateField(null=True, blank=True)  # Nullable for non-admitted
    discharge_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    current_condition = models.TextField(blank=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=255, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.CharField(max_length=10, choices=IS_ACTIVE_CHOICES, default='Active')



    def deactivate_patient(self):
        self.is_active = 'Inactive'
        self.save()

    def __str__(self):
        return self.name

# Medical History (Separate model for better structure)
class MedicalHistory(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_histories')
    entry_date = models.DateField(auto_now_add=True)
    notes = models.TextField()
    diagnosed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.patient.name} - {self.entry_date}"



















#How Billing Works?
#1: Create or Get existing Bill first.
#2: Create PatientService to assign the <Patient |and| Service_that_patient_Availed>
#3: Create a BillingItem
    #WHERE Once you have a PatientService record, 
    # create a corresponding BillingItem that links this service to the Billing record.
#4: Update the Billing Total
    #Recalculate Total Due: (automatic na ito satin)



#Optional Visualizer
'''Visual Workflow
1: Patient visits and avails a service.

2: Check for an existing active bill:
        Yes: Use that bill.
        No: Create a new Billing record.
        when to create?? dipende sa hospital rule. Per visit? session? day?

3: Record the service:
        Create a PatientService entry for the availed service.
        REMEMBERL PatientService records <Patient |and| Service_that_patient_Availed>

4: Create a BillingItem:
        Link the PatientService record to the Billing record.

5: Update the bill's total_due:
        Sum up all BillingItem subtotals and update the bill.'''

# Service Model with price history tracking
class Service(models.Model):
    name = models.CharField(max_length=100)
    current_cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

# Patient Services Availed with historical pricing
class PatientService(models.Model):
    #Many PatientService to One patient
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='services')
    #Many PatientService to One service
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    date_availed = models.DateTimeField(auto_now_add=True)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    #Current PRICE nung inavail niya yung SERVICE.. mamaya discounted or tumaas... so PRICE SETTINGS is FLEXIBLE...

    # cost_at_time will be set to the Service's current_cost if not provided
    cost_at_time = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        """Capture price at time of service"""
        if not self.cost_at_time:
            self.cost_at_time = self.service.current_cost
        super().save(*args, **kwargs)

    @property
    def subtotal(self):
        return self.quantity * self.cost_at_time

    def __str__(self):
        return f"{self.patient.name} - {self.service.name}"

# Billing Model with calculated total
#PATIENT SERVICE MUST BE NULL AT FIRST



class Billing(models.Model):
    STATUS_CHOICES = [
        ('Unpaid', 'Unpaid'),
        ('Partial', 'Partially Paid'),
        ('Paid', 'Fully Paid'),
        ('Cancelled', 'Cancelled'),
    ]
    #Many Billing to One patient
    #Who OWNS the BILL
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='bills')
    #To connect Patient and Service
    patient_services = models.ManyToManyField(PatientService, through='BillingItem', blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Unpaid')
    total_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def update_total(self):
        """Recalculate the total amount based on services availed."""
        self.total_due = sum(item.subtotal for item in self.billing_items.all())

    def save(self, *args, **kwargs):
        """Override save method to prevent recursion and save related objects"""
        # Save the instance first to generate the primary key
        if not self.pk:  # Only save if not saved yet (first save)
            super().save(*args, **kwargs)
        
        # After saving the Billing instance, calculate the total
        self.update_total()
        
        # Now save the instance with the updated total_due
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Bill #{self.id} - {self.patient.name} ({self.status})"

class BillingItem(models.Model):
    #Many BillingItem to One billing
    billing = models.ForeignKey(Billing, on_delete=models.CASCADE, related_name='billing_items')
    #Many BillingItem to One service_availed
    service_availed = models.ForeignKey(PatientService, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        """Calculate subtotal before saving."""
        self.quantity = self.service_availed.quantity
        self.subtotal = self.service_availed.subtotal
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.service_availed.service.name} - {self.service_availed.quantity} x {self.service_availed.service.current_cost}"
    




















# Laboratory Results with multiple file attachments
def lab_result_upload_path(instance, filename):
    return f'lab_results/patient_{instance.result.patient.id}/{instance.result.test_type}/{filename}'


class LaboratoryResult(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='lab_results')
    test_type = models.CharField(max_length=50)
    result_summary = models.TextField()
    date_performed = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.patient.name} - {self.test_type}"

class LabResultFile(models.Model):
    result = models.ForeignKey(LaboratoryResult, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to=lab_result_upload_path)
    description = models.CharField(max_length=255, blank=True)

# Unified Clinical Notes
class ClinicalNote(models.Model):
    NOTE_TYPES = [
        ('Doctor', 'Doctor Note'),
        ('Nurse', 'Nurse Note'),
        ('General', 'General Note')
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='clinical_notes')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    note_type = models.CharField(max_length=20, choices=NOTE_TYPES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.name} - {self.note_type}"

# Improved User Logs
class UserLog(models.Model):
    ACTION_CHOICES = [
        ('LOGIN', 'User Login'),
        ('LOGOUT', 'User Logout'),
        ('CREATE', 'Record Created'),
        ('UPDATE', 'Record Updated'),
        ('DELETE', 'Record Deleted'),
        ('VIEW', 'Record Viewed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField()  # Store additional context as JSON

    def __str__(self):
        return f"{self.user} - {self.get_action_display()} at {self.timestamp}"




#aduashdasdh adfh ad hisdf ihsdf khsdf kzz




# Payment Model
class Payment(models.Model):
    billing = models.OneToOneField(Billing, on_delete=models.CASCADE, related_name='payment')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=[
        ('Cash', 'Cash'), ('Card', 'Card'), ('Insurance', 'Insurance')
    ])
    date_paid = models.DateTimeField(auto_now_add=True)
    received_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Payment for Bill #{self.billing.id} - {self.amount_paid}"