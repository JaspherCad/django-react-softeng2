from decimal import Decimal
import math
from django.db import transaction

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db.models import F
from django.db import models
import shortuuid
from shortuuid.django_fields import ShortUUIDField
from simple_history.models import HistoricalRecords

def generate_billing_code():
    #8-character random, URL-safe, no confusing chars I 1 0 0
    return shortuuid.ShortUUID(
        alphabet="ABCDEFGHJKMNPQRSTUVWXYZ23456789"
    ).random(length=8)

def generate_patient_code():
    return shortuuid.ShortUUID(
        alphabet="ABCDEFGHJKMNPQRSTUVWXYZ23456789"  # Avoids ambiguous chars like 0, O, I, 1, etc.
    ).random(length=5)

def validate_file_extension(value):
    import os
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.dcm'] 
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')
    
def generate_laboratoryresult_code():
    #8-character random, URL-safe, no confusing chars I 1 0 0
    return shortuuid.ShortUUID(
        alphabet="ABCDEFGHJKMNPQRSTUVWXYZ23456789"
    ).random(length=6)


# Custom User Manager
class CustomUserManager(BaseUserManager):
    #wait. this is boiler plate ng django no need to overThink
    #yung role,department,is_activel,is_staff attributes is passed into **extra_fields
    def create_user(self, user_id, password=None, **extra_fields):
        if not user_id:
            raise ValueError("User ID is required")
        user = self.model(user_id=user_id, **extra_fields)
        #password hashed here
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, user_id, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(user_id, password, **extra_fields)

#update file upload


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
    
    
    #this is where the actual user creation is happening
    objects = CustomUserManager()


    # personal Information --- update.
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name  = models.CharField(max_length=30, blank=True, null=True)
    email      = models.EmailField(blank=True, null=True)
    phone      = models.CharField(max_length=20, blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)

    
    USERNAME_FIELD = 'user_id'
    #USERNAME_FIELD = 'user_id' so if i said this, then the username field is changed to user_id?
    REQUIRED_FIELDS = ['role', 'department']

    def __str__(self):
        return self.user_id

    def save(self, *args, **kwargs):
        """Automatically add to appropriate group based on role"""
        super().save(*args, **kwargs)
        if self.role:
            group, _ = Group.objects.get_or_create(name=self.role)
            self.groups.add(group)

















# Patient Model
#NOTE!! DO NOT DELETE PATIENTS!
class Patient(models.Model):
    STATUS_CHOICES = [
        ('Admitted', 'Admitted'), #Inpatient dapat!
        ('Discharged', 'Discharged'),
        ('Outpatient', 'Outpatient')
    ]
    IS_ACTIVE_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Deleted', 'Deleted'),
    ]


    CIVIL_STATUS_CHOICES = [
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Widowed', 'Widowed'),
        ('Divorced', 'Divorced'),
        ('Separated', 'Separated')
    ]
    
    VISIT_TYPE_CHOICES = [
        ('New', 'New'),
        ('Follow-up', 'Follow-up')
    ]



    # Insurance & Case Information
    has_philhealth = models.BooleanField(default=False)
    case_number = models.CharField(
        unique=True,
        db_index=True,
        null=True,
        blank=False,
        default=None,
        max_length=255
    )

    hospital_case_number = models.CharField(
        null=True,
        blank=False,
        default=None,
        max_length=255
    )


    has_hmo = models.BooleanField(default=False)
    hmo = models.CharField(
        null=True,
        blank=True,
        max_length=255
     
    )

#save state save state save state save state!   #   $   % anti cntrl z
    code = ShortUUIDField(
        length=5,
        alphabet="ABCDEFGHJKMNPQRSTUVWXYZ23456789",
        unique=True,
        editable=False,
        null=False,
        default=generate_patient_code,
        # help_text="Unique 5-character patient code"
    )

    #Essential Fields for Emergency Admission
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    admission_date = models.DateTimeField(null=True, blank=True)
    

    current_condition = models.TextField()

    # Optional Fields (Can Be Added Later)
    date_of_birth = models.DateField(null=True, blank=True) 
    address = models.CharField(max_length=255, null=True, blank=True)
    occupation = models.CharField(max_length=100, null=True, blank=True)
    civil_status = models.CharField(max_length=20, choices=CIVIL_STATUS_CHOICES, null=True, blank=True)
    nationality = models.CharField(max_length=100, null=True, blank=True)
    religion = models.CharField(max_length=100, null=True, blank=True)



    # Consultation Info
    attending_physician = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='patients'
    )
    visit_type = models.CharField(max_length=20, null=True, blank=True, choices=[
        ('New', 'New'), ('Follow-up', 'Follow-up')
    ])
    consultation_datetime = models.DateTimeField(null=True, blank=True)
    referred_by = models.CharField(max_length=255, null=True, blank=True)
    next_consultation_date = models.DateTimeField(null=True, blank=True)


    discharge_date = models.DateTimeField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    # email = models.EmailField(blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=255, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.CharField(max_length=10, choices=IS_ACTIVE_CHOICES, default='Active')



    #MEDICAL INFORMATION: should be sepeareted as MedicalHistory.. but merge as one for now.
    entry_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField()
    diagnosed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    blood_pressure = models.CharField(max_length=20, null=True, blank=True)
    pulse_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    respiratory_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    physical_examination = models.TextField(null=True, blank=True)
    main_complaint = models.TextField(null=True, blank=True)
    present_illness = models.TextField(null=True, blank=True)
    clinical_findings = models.TextField(null=True, blank=True)
    icd_code = models.CharField(max_length=20, null=True, blank=True)
    diagnosis = models.TextField(null=True, blank=True)
    treatment = models.TextField(null=True, blank=True)


    #UPDATE! tracks historical record PER event. u know push get patch etc
    history = HistoricalRecords()

    def deactivate_patient(self):
        self.is_active = 'Inactive'
        self.save()

    def __str__(self):
        return f" ID {self.id} - {self.name}"

# Medical History (Separate model for better structure)
class MedicalHistory(models.Model):

    #WHY CASCADE????
    # It's particularly useful when the related objects (like medical histories) don't make sense without their parent object (the patient). For example, a  record without a  would lack crucial context and likely cause errors or confusion in your application.
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_histories')
    

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
        return f"{self.name}: ID - {self.id}"
    
    

# Patient Services Availed with historical pricing
#DELETE? no Keep PatientService to maintain historical pricing, decoupled service tracking, and accurate billing. It is a core part of your system’s design.
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
        return f"{self.patient.name} - {self.service.name} ({self.cost_at_time}) ({self.id})"
#safe safe
# Billing Model with calculated total
#PATIENT SERVICE MUST BE NULL AT FIRST



class Billing(models.Model):
    STATUS_CHOICES = [
        ('Unpaid', 'Unpaid'),
        ('Partial', 'Partially Paid'),
        ('Paid', 'Fully Paid'),
        ('Cancelled', 'Cancelled'),
    ]



    code = ShortUUIDField(
        length=8,
        alphabet="ABCDEFGHJKMNPQRSTUVWXYZ23456789",
        unique=True,
        editable=False,
        null=False,              
        default=generate_billing_code
    )
    #Many Billing to One patient
    #Who OWNS the BILL.... so one to MANY (no need models.oneToMany)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='bills')
    #To connect Patient and Service
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='bills_created')
    operator = models.ManyToManyField(User, related_name='bills_operated', blank=True)
    

    #NONSENSE ITOOO NEVERMIND THIS SHIT BUT DONT REMOVE
    patient_services = models.ManyToManyField(PatientService, through='BillingItem', blank=True)
    #NONSENSE ITOOO NEVERMIND THIS SHIT BUT DONT REMOVE



    date_created = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Unpaid')
    total_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    #TODO: THIS IS TWO WAY RELATIONSHIO.. implicitly / hidden association
    # billing_items = models.ForeignKey(Billing, on_delete=models.CASCADE, related_name='billing_items')



    def update_total(self):
        """Recalculate the total amount based on services availed."""
        self.total_due = sum(item.subtotal for item in self.billing_items.all()) or Decimal('0.00')
        
    def save(self, *args, **kwargs):
        """Override save method to prevent recursion and save related objects"""
        # Save the instance first to generate the primary key
        if self.pk:
            self.update_total()
        super().save(*args, **kwargs)


    def __str__(self):
        return f"Bill # {self.id}  ({self.code}) -  {self.patient.name} ({self.status})"





class BillingOperatorLog(models.Model):
    billing = models.ForeignKey(Billing, on_delete=models.CASCADE, related_name='operator_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=50, blank=True, null=True)  # e.g., "Bill Updated", "Payment Processed"


















# Laboratory Results with multiple file attachments
def lab_result_upload_path(instance, filename):
    return f'lab_results/patient_{instance.result.patient.id}/{instance.result.test_type}/{filename}'


class LaboratoryResult(models.Model):
    #many to one
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='lab_results')
    test_type = models.CharField(max_length=50)
    result_summary = models.TextField()
    date_performed = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    code = ShortUUIDField(
        length=8,
        alphabet="ABCDEFGHJKMNPQRSTUVWXYZ23456789",
        unique=True,
        editable=False,
        null=False,              
        default=generate_laboratoryresult_code
    )

    def __str__(self):
        return f"  {self.code} = {self.patient.name} - {self.test_type} - {self.id}"

class LabResultFile(models.Model):
    #MANY LabResultFile TO ONE
    result = models.ForeignKey(LaboratoryResult, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(
        upload_to=lab_result_upload_path,
        validators=[validate_file_extension]
        
        )
    description = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)




def user_image_upload_path(instance, filename):
    return f'user_images/{instance.user.user_id}/{filename}'

class UserImage(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='images'
    )
    file = models.FileField(
        upload_to=user_image_upload_path,
        validators=[validate_file_extension]  
    )
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_user_images'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id} for {self.user.user_id}"














############GROUP UPLOAD
def grouped_lab_result_upload_path(instance, filename):
    return f'lab_results/patient_{instance.group.result.patient.id}/{instance.group.result.test_type}/{filename}'

class LabResultFileGroup(models.Model):
    result = models.ForeignKey(
        LaboratoryResult, 
        on_delete=models.CASCADE,
        related_name='file_groups'  
    )
    description = models.TextField(blank=True)  #single description per group
    uploaded_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # shows “Patient Name – Test Type – Group ID”
        return f"LAB:{self.result.id} – Album ID: {self.id} – Description = ''{self.description}'' "

#represents individual files within a group
class LabResultFileInGroup(models.Model):  
    group = models.ForeignKey(
        LabResultFileGroup,  #refers to the group.. MANY to ONE
        on_delete=models.CASCADE,
        related_name='files' 
    )
    file = models.FileField(
        upload_to=grouped_lab_result_upload_path,  # fix this too
        validators=[validate_file_extension]
    )

    def __str__(self):
        return f"Album Id {self.group.id} – {self.file.name.split('/')[-1]}"












# ROOMS (updated by sir jess)
class Room(models.Model):
    name = models.CharField(max_length=100)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} - ₱{self.hourly_rate}/hr"

class Bed(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    number = models.CharField(max_length=10, unique=True)
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f" ID: {self.id} - {self.room.name} - Bed {self.number}"



class BedAssignment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='bed_assignments')
    bed = models.ForeignKey(Bed, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    last_billed_time = models.DateTimeField(null=True, blank=True)
    total_hours = models.PositiveIntegerField(default=0)
    billing = models.ForeignKey(Billing, on_delete=models.SET_NULL, null=True, blank=True) 

    def __str__(self):
        return f"{self.patient.name} - Bed {self.bed.number}"






    # <-START TIME ---------------CURRENT TIME----(if set, END_TIME)->

    def get_current_hours(self):
        if self.end_time:
            duration = self.end_time - self.start_time
        else:
            duration = timezone.now() - self.start_time
        return max(1, math.ceil(duration.total_seconds() / 60))  #3600 1hr 60 1 min
    
    # def get_current_hours(self):
    #     if self.end_time:
    #         duration = self.end_time - self.start_time
    #     else:
    #         duration = timezone.now() - self.start_time
    #     return max(1, math.ceil(duration.total_seconds() / 60))





    #UPDATE! we trigger this at TASKS.py (ASYNC) this is like SERVICE.py
    @transaction.atomic
    def create_billing_item(self):
        # Create BillingItem directly linked to this BedAssignment
        self.refresh_from_db()
        billing_item = BillingItem.objects.create(
            billing=self.billing,
            bed_assignment=self,
            quantity=1,
            subtotal=self.bed.room.hourly_rate
        )
        
        
        
        #update tracking
        self.total_hours += 1
        self.last_billed_time = timezone.now()
        self.save(update_fields=['total_hours', 'last_billed_time'])
        
        return billing_item
    



    #note to anyone: THIS IS JUST LIKE A BASE
    # create billing but only when there are unbilled minutes/hours at the time of discharge.
    @transaction.atomic
    def create_final_billing_item(self):
        self.refresh_from_db()
        if not self.billing:
            raise ValidationError("No billing linked")
        
        #ONLY compute this if there are KULANG SA TIME
        hours = self.get_current_hours() - self.total_hours
        if hours < 1:
            return None #if wala, keep the exsiting BILLING ITEM

        billing_item = BillingItem.objects.create(
            billing=self.billing,
            bed_assignment=self,
            quantity=hours,
            subtotal=self.bed.room.hourly_rate * hours
        )

        self.total_hours += hours
        self.last_billed_time = timezone.now()
        self.save(update_fields=['total_hours', 'last_billed_time'])
        return billing_item
    # def create_billing_item(self, hours):
        
    #     #creates PatientService + BillingItem
    #     #creates PatientService + BillingItem
    #     #creates PatientService + BillingItem
    #     #creates PatientService + BillingItem



    #     # Get the "Bed Fee" service
    #     bed_fee_service = Service.objects.get(name="Bed Fee")
        
    #     # Create PatientService with historical cost
    #     patient_service = PatientService.objects.create(
    #         patient=self.patient,
    #         service=bed_fee_service,
    #         quantity=hours,
    #         cost_at_time=bed_fee_service.current_cost
    #     )
        
    #     # Get or create an active bill for the patient
    #     billing, created = Billing.objects.get_or_create(
    #         patient=self.patient,
    #         status='Unpaid',
    #         defaults={'created_by': self.assigned_by}
    #     )
        
    #     # Create BillingItem
    #     billing_item = BillingItem.objects.create(
    #         billing=billing,
    #         service_availed=patient_service,
    #         quantity=hours,
    #         subtotal=patient_service.subtotal
    #     )
        
    #     # Update BedAssignment tracking
    #     self.total_hours += hours
    #     self.last_billed_time = timezone.now()
    #     self.save(update_fields=['total_hours', 'last_billed_time'])
        
    #     # Recalculate total due
    #     billing.update_total()
    #     return billing_item

    # def create_billing_item(self, hours, billing=None):
        
    #     #creates PatientService + BillingItem
    #     #creates PatientService + BillingItem
    #     #creates PatientService + BillingItem
    #     #creates PatientService + BillingItem



    #     # Get the "Bed Fee" service
    #     bed_fee_service = Service.objects.get(name="Bed Fee")

    #     if not billing:
    #         billing = Billing.objects.filter(
    #             patient=self.patient,
    #             status='Unpaid'
    #         ).order_by('-date_created').first()
            
    #         if not billing:
    #             raise ValidationError(
    #                 f"Cannot create billing item: No unpaid bill found for patient {self.patient.id}"
    #             )
            
    #     # Create PatientService
    #     patient_service = PatientService.objects.create(
    #         patient=self.patient,
    #         service=bed_fee_service,
    #         quantity=hours,
    #         cost_at_time=bed_fee_service.current_cost
    #     )

    #     # Create BillingItem
    #     billing_item = BillingItem.objects.create(
    #         billing=billing,
    #         service_availed=patient_service,
    #         quantity=hours,
    #         subtotal=patient_service.subtotal
    #     )

    #     # Update BedAssignment tracking
    #     self.total_hours += hours
    #     self.last_billed_time = timezone.now()
    #     self.save(update_fields=['total_hours', 'last_billed_time'])

    #     # Recalculate total due
    #     billing.update_total()
    #     return billing_item










class BillingItem(models.Model):
    #Many BillingItem to One billing



    # Exactly. The related_name attribute in a model’s foreign key is used to create a reverse relationship. This reverse relationship lets you access all instances of the related model—even though you didn’t explicitly declare a field in the first model to store that data.
    billing = models.ForeignKey(Billing, on_delete=models.CASCADE, related_name='billing_items')



    # LATEST UPDATE: Billing item can have ONE only of the following. SERVICE, ROOM, (? pharmacy), etc...
    #Many BillingItem to One service_availed
    
    service_availed = models.ForeignKey(
        PatientService, 
        on_delete=models.CASCADE, 
        null=True,
        blank=True
    )

    bed_assignment = models.ForeignKey(
        BedAssignment, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )


    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def clean(self):
        #asssure only one of patient_service or bed_assignment is set#
        if self.service_availed and self.bed_assignment:
            raise ValidationError("A BillingItem must link to either PatientService or BedAssignment, not both")
        if not self.service_availed and not self.bed_assignment:
            raise ValidationError("A BillingItem must link to either PatientService or BedAssignment")


    def save(self, *args, **kwargs):
        """Calculate subtotal before saving."""
        # UPDATE: Calculate quantity and subtotal based on which relation is set
        if self.service_availed:
            self.quantity = self.service_availed.quantity
            self.subtotal = self.service_availed.subtotal
        elif self.bed_assignment:
            self.quantity = 1  # Bed assignment is billed hourly
            self.subtotal = self.bed_assignment.bed.room.hourly_rate
        else:
            raise ValidationError("No service or bed assignment linked")

        super().save(*args, **kwargs)

        # self.quantity = self.service_availed.quantity
        # self.subtotal = self.service_availed.subtotal
        # super().save(*args, **kwargs)
        #IF SAVED, we have signal listener to update the billing.totalDue

    # def __str__(self):
    #     return f"{self.service_availed.service.name} - {self.service_availed.quantity} x {self.service_availed.service.current_cost}"
    def __str__(self):
        if self.service_availed:
            return f"{self.service_availed.service.name} - {self.service_availed.quantity} x {self.service_availed.service.current_cost}"
        elif self.bed_assignment:
            return f"Bed Fee - {self.quantity} x {self.bed_assignment.bed.room.hourly_rate}"
        else:
            return "Unlinked Billing Item"
    
    


#     { POST SAMPLE DATA
#     "billing": 5, id
#     "service_availed": 12
# }









# Unified Clinical Notes
class ClinicalNote(models.Model):
    NOTE_TYPES = [
        ('Doctor', 'Doctor Note'),
        ('Nurse', 'Nurse Note'),
        ('General', 'General Note'),
        ('Medication', 'Medication Note'),
    ]

    
    #save satate
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='clinical_notes')

    #ClinicalNote.objects.filter(patient__case_number='CN-20250617-001') to FILTER the notes to patient 

    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, help_text="Who created this note"
    )

    note_type = models.CharField(
        max_length=120,
        choices=NOTE_TYPES,
        null=True,
        blank=True
    )

    #date/shift additional
    # date/shift additional
    note_date = models.DateTimeField(
        default=timezone.now,
        null=True,
        blank=True,
        help_text="Date/time for this note (can represent shift)"
    )

    focus_problem = models.TextField(
        null=True,
        blank=True,
        help_text="Primary problem or focus of this note"
    )
    progress_notes = models.TextField(
        null=True,
        blank=True,
        help_text="Progress since last note"
    )
    orders = models.TextField(
        null=True,
        blank=True,
        help_text="Any new orders (labs, imaging, meds, etc.)"
    )
    content = models.TextField(
        null=True,
        blank=True,
        help_text="General narrative (if applicable)"
    )


        # Medication‑specific fields
    medication = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Medication name (for Medication notes)"
    )
    dose_frequency = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="e.g. 'Once daily', '2x per day'"
    )


    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        null=True,
        blank=True
    )

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
        return f"Payment for Bill # - {self.amount_paid}"