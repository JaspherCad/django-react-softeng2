from rest_framework import serializers
from .models import User, Patient, LaboratoryResult, LabResultFile, UserLog, Service, PatientService, Billing, BillingItem # Import your custom User model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "user_id", "password", "role", "department", "is_active", "is_staff"]
        extra_kwargs = {
            "password": {"write_only": True},  # Ensure the password is write-only
        }

    def create(self, validated_data):
        # Use the create_user method from your CustomUserManager
        user = User.objects.create_user(
            user_id=validated_data['user_id'],
            password=validated_data['password'],
            role=validated_data['role'],
            department=validated_data['department'],
            is_active=validated_data.get('is_active', True),
            is_staff=validated_data.get('is_staff', False),
        )
        return user

    def update(self, instance, validated_data):
        # Handle updating the user instance
        instance.user_id = validated_data.get('user_id', instance.user_id)
        instance.role = validated_data.get('role', instance.role)
        instance.department = validated_data.get('department', instance.department)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)

        # Handle password update
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()
        return instance
    




class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class PatientServieSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientService
        fields = '__all__'




class LabResultFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResultFile
        fields = ['id', 'file', 'description']

class LaboratoryResultSerializer(serializers.ModelSerializer):
    #result.. this is the result LaboratoryResult
    attachments = LabResultFileSerializer(many=True, read_only=True)  # For displaying uploaded files

    class Meta:
        model = LaboratoryResult
        fields = ['id', 'patient', 'test_type', 'result_summary', 'date_performed', 'performed_by', 'attachments']

#save state save stat eito hahaha 123 

class UserLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLog
        fields = '__all__'











#BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'current_cost']

class PatientServiceSerializer(serializers.ModelSerializer):
    #WHY??? tho wala sa database, kasama yan sa OUTPUT! @property
    subtotal = serializers.ReadOnlyField()

    #to accept ID as input.. look at the views
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())

    class Meta:
        model = PatientService
        fields = [
            'id', 'patient', 'service', 'date_availed', 
            'quantity', 'cost_at_time', 'subtotal'
        ]







class BillingItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = BillingItem
        fields = ['id', 'billing', 'service_availed', 'quantity', 'subtotal']
        extra_kwargs = {
            'subtotal': {'read_only': True},  # Ensure subtotal is read-only
        }


from rest_framework import serializers
from .models import Billing

class BillingSerializer(serializers.ModelSerializer):
    #WITH THIS... pwede maging ganto
#     {
#   "id": 10,
#   "patient": "John Doe",
#   "date_created": "2025-03-10T08:45:30Z",
#   "status": "Unpaid",
#   "total_due": "150.00",
#   "billing_items": [
#     {
#       "id": 3,
#       "quantity": 2,
#       "subtotal": "100.00",
#       "service_availed": "John Doe - X-Ray"
#     },
#     {
#       "id": 4,
#       "quantity": 1,
#       "subtotal": "50.00",
#       "service_availed": "John Doe - Blood Test"
#     }
#   ]
# }

    # Exactly. The related_name attribute in a model’s foreign key is used to create a reverse relationship. This reverse relationship lets you access all instances of the related model—even though you didn’t explicitly declare a field in the first model to store that data.
    billing_items = BillingItemSerializer(many=True, read_only=True)

    class Meta:
        model = Billing
        fields = ['id', 'patient', 'date_created', 'status', 'total_due', 'billing_items']
        extra_kwargs = {
            'total_due': {'read_only': True},
        }


class BillingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        # You may not allow updating of total_due via API, as it's computed.
        fields = ['patient', 'status']  
        extra_kwargs = {
            'status': {'default': 'Unpaid'},
        }

#BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS

