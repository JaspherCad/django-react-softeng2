from rest_framework import serializers
from .models import ClinicalNote, PatientImage, User, Patient, LaboratoryResult, LabResultFile, UserImage, UserLog, Service, PatientService, Billing, BillingItem, LabResultFileInGroup, LabResultFileGroup, Bed, Room, BedAssignment, MedicalHistory, UserSecurityQuestion

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "first_name","last_name","user_id", "groups","password", "role", "department", "is_active", "is_staff", "address", "birthdate","images"
]
        extra_kwargs = {
            "password": {"write_only": True}, 
            'is_staff': {'read_only': True}
        }

    #battery included functions : IDK man thats why I hate django too many unknowns
    def get_groups(self, obj):
        from .serializers import GroupSerializer  
        return GroupSerializer(obj.groups.all(), many=True).data

    def get_images(self, obj):
        images = obj.images.all()
        return UserImageSerializer(images, many=True, context=self.context).data

    # def create(self, validated_data):
    #     # Use the create_user method from your CustomUserManager
    #     user = User.objects.create_user(
    #         user_id=validated_data['user_id'],
    #         password=validated_data['password'],
    #         role=validated_data['role'],
    #         department=validated_data['department'],
    #         is_active=validated_data.get('is_active', True),
    #         is_staff=validated_data.get('is_staff', False),
    #     )
    #     return user

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        
        user = User.objects.create_user(
            user_id=validated_data['user_id'],
            role=validated_data['role'],
            department=validated_data['department'],
            is_active=validated_data.get('is_active', True),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email'),
            phone=validated_data.get('phone'),
            address=validated_data.get('address'),
            birthdate=validated_data.get('birthdate')
        )
        
        if password:
            user.set_password(password)
            user.save(update_fields=['password'])
        
        self._set_is_staff(user)
        
        return user

    
    def update(self, instance, validated_data):
        instance.user_id = validated_data.get('user_id', instance.user_id)
        instance.role = validated_data.get('role', instance.role)
        instance.department = validated_data.get('department', instance.department)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.birthdate = validated_data.get('birthdate', instance.birthdate)
        
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()

        self._set_is_staff(instance)

        self._update_user_groups(instance)

        return instance
    
    def _set_is_staff(self, user):
        """Set is_staff flag based on role"""
        if user.role in ['Admin', 'Doctor', 'Teller', 'Nurse', 'Receptionist']:
            user.is_staff = True
        else:
            user.is_staff = False

    def _update_user_groups(self, user):
        user.groups.clear()
        
        if user.role:
            group, _ = Group.objects.get_or_create(name=user.role)
            user.groups.add(group)  
    

class UserSecurityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSecurityQuestion
        fields = ['id', 'question', 'answer']
        extra_kwargs = {
            'answer': {'write_only': True}
        }

class PasswordResetSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

class ClinicalNoteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ClinicalNote
        fields = [
            'id','patient','case_number_patient', 'author','note_type','note_date',
            'focus_problem','progress_notes','orders','content',
            'medication','dose_frequency','created_at','updated_at'
        ]



class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class PatientImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientImage
        fields = ['id', 'patient', 'file', 'description', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['uploaded_by', 'uploaded_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, "user"):
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)


class MedicalHistorySerializer(serializers.ModelSerializer):
    diagnosed_by = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalHistory
        fields = '__all__'
    
    def get_diagnosed_by(self, obj):
        if obj.diagnosed_by:
            return {
                'id': obj.diagnosed_by.id,
                'user_id': obj.diagnosed_by.user_id,
                'role': obj.diagnosed_by.role
            }
        return None

class PatientServieSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientService
        fields = '__all__'











#MULTIPLE UPLOAD SERIALIZER
class LabResultFileInGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResultFileInGroup
        fields = ['id', 'file']

class LabResultFileGroupSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    files = LabResultFileInGroupSerializer(many=True, read_only=True)
    
    class Meta:
        model = LabResultFileGroup
        fields = [
            'id',
            'description',
            'uploaded_by',
            'uploaded_at',
            'files'

        ]











#ORIGINAL SINGLE FILE UPLOAD


class LabResultFileSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    class Meta:
        model = LabResultFile
        fields = ['id', 'file', 'description', 'uploaded_by', 'uploaded_at']

class PatientInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'code']

class LaboratoryResultSerializer(serializers.ModelSerializer):
    #result.. this is the result LaboratoryResult
    attachments = LabResultFileSerializer(many=True, read_only=True)  # For displaying uploaded files


    # #PS: TODO delte attachments above if this works
    file_groups = LabResultFileGroupSerializer(many=True, read_only=True)
    patientInfo = PatientInfoSerializer(source='patient', read_only=True)
    class Meta:
        model = LaboratoryResult
        fields = ['id', 'code', 'patient', 'patientInfo','test_type', 'result_summary', 'date_performed', 'performed_by', 'attachments', 'file_groups']




class PatientHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.SerializerMethodField()
    changes = serializers.SerializerMethodField()
    original_case_number = serializers.SerializerMethodField()

        
    class Meta:
        model = Patient.history.model
        fields = '__all__' 

    def get_changed_by(self, obj):
        if hasattr(obj, 'history_user') and obj.history_user:
            return {
                'id': obj.history_user.id,
                'user_id': obj.history_user.user_id,
                'role': obj.history_user.role
            }
        return None
    
    def get_original_case_number(self, obj):
        # obj.changes is a dict like {"case_number": {"old": "...", "new": "..."}}
        changes = getattr(obj, 'changes', {}) or {}
        if 'case_number' in changes:
            return changes['case_number'].get('old')
        # if it never changed, fall back to whatever the snapshot shows
        return obj.case_number


    def get_changes(self, obj):
        
        try:
            prev = obj.prev_record
            if prev:
                diff = obj.diff_against(prev)
                return {
                    change.field: {
                        'old': change.old,
                        'new': change.new
                    }
                    for change in diff.changes
                }
            return {}
        except Exception as e:
            return {}
        
        
#save state save stat eito hahaha 123 

class UserLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLog
        fields = '__all__'









#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'hourly_rate']





class BedSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)  # Nested room info

    class Meta:
        model = Bed
        fields = ['id', 'room', 'number', 'is_occupied']

class BedAssignmentSerializer(serializers.ModelSerializer):
    bed = BedSerializer(read_only=True)

    class Meta:
        model = BedAssignment
        fields = [
            'id', 'patient', 'bed', 'assigned_by', 'start_time',
            'end_time', 'total_hours', 'last_billed_time', 'billing'
        ]
        read_only_fields = ['bed', 'start_time', 'total_hours', 'last_billed_time']



#FOR FETCHING (sole purpose is fetching only)
class BedOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = ['id', 'number', 'is_occupied']

class RoomWithBedInfoSerializer(serializers.ModelSerializer):
    beds = BedOnlySerializer(source='bed_set', many=True, read_only=True)  

    class Meta:
        model = Room
        fields = ['id', 'name', 'hourly_rate', 'beds']

#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS#ROOM SERIALIZERS









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
    service_name = serializers.SerializerMethodField(read_only=True)
    service_id = serializers.ReadOnlyField(source='service_availed.service.id')
    bed_assignment = BedAssignmentSerializer(read_only=True)


    class Meta:
        model = BillingItem
        fields = ['id', 'billing', 'service_availed', 'bed_assignment',"service_id", 'service_name', 'quantity', 'subtotal']
        extra_kwargs = {
            'subtotal': {'read_only': True},  
        }

    def get_service_name(self, obj):
        
        if obj.service_availed and obj.service_availed.service:
            return obj.service_availed.service.name
        return None
     
class BillingItemCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BillingItem
        fields = ['billing', 'service_availed', 'quantity', 'subtotal']  
        extra_kwargs = {
            'status': {'default': 'Unpaid'},
            'created_by': {'read_only': True},
            'operator': {'read_only': True},
        }

    #OVERRIDING CREATE to replace it by BillingItem.save()
    def create(self, validated_data):
        item = BillingItem.objects.create(**validated_data)
        return item



from rest_framework import serializers
from .models import Billing


class Billing_User_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'code']


#ONLY FOR SPECIFIC BILLING... for general, remove the list of BILLING ITEM for faster laoding
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
    patient = Billing_User_Serializer(read_only=True)
    billing_items = BillingItemSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    operator = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Billing
        fields = ['id', 'code', 'patient', 'date_created', 'status', 'total_due', 'billing_items', 'created_by', 'operator']
        extra_kwargs = {
            'total_due': {'read_only': True},
            'code': {'read_only': True},
            'created_by': {'read_only': True},
            'operator': {'read_only': True},


        }


class UserImageSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.PrimaryKeyRelatedField(read_only=True)
    file = serializers.SerializerMethodField() 

    class Meta:
        model = UserImage
        fields = ['id', 'user', 'file', 'description', 'uploaded_by', 'uploaded_at']
        extra_kwargs = {
            'user': {'read_only': True},
            'file': {'required': True},
            'description': {'required': False}
        }
    def get_file(self, obj):
        request = self.context.get('request')
        if obj.file:
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None

        
class BillingSerializerNoList(serializers.ModelSerializer):
    #since we cant see the name of the Patient name (instead we got id)
    #find way to do it where patient == id and name
    created_by = UserSerializer(read_only=True)
    operator = UserSerializer(many=True, read_only=True)
    patient = Billing_User_Serializer(read_only=True)
    class Meta:
        model = Billing
        fields = ['id', 'patient', 'date_created', 'status', 'total_due', 'code', 'created_by', 'operator']
        extra_kwargs = {
            'total_due': {'read_only': True},
            'date_created': {'read_only': True},
        
        }

class Billing_PatientInfo_Serializer(serializers.ModelSerializer):
    #since we cant see the name of the Patient name (instead we got id)
    #find way to do it where patient == id and name

    created_by = UserSerializer(read_only=True)
    operator = UserSerializer(many=True, read_only=True)
    patient = Billing_User_Serializer(read_only=True)

    patient = PatientSerializer(read_only=True)
    billing_items = BillingItemSerializer(many=True, read_only=True)
    class Meta:
        model = Billing
        fields = ['id', 'patient', 'date_created', 'status', 'total_due', 'billing_items', 'code', 'created_by', 'operator']
        extra_kwargs = {
            'total_due': {'read_only': True},
            'date_created': {'read_only': True},
        
        }
#save state
from django.contrib.auth.models import Group, Permission


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

class UserCreateSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True, required=False)
    user_permissions = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = User
        fields = [
            'user_id',
            'role',
            'department',
            'is_active',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions'
        ]

    def validate_user_id(self, value):
        if User.objects.filter(user_id=value).exists():
            raise serializers.ValidationError("User ID already taken.")
        return value



class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']


class GroupPermissionUpdateSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(), 
        many=True, 
        required=False
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']





class BillingCreateSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    operator = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Billing
        # You may not allow updating of total_due via API, as it's computed.
        fields = ['patient', 'status', 'created_by', 'operator']  
        extra_kwargs = {
            'status': {'default': 'Unpaid'},
            'created_by': {'read_only': True},
            'operator': {'read_only': True},
        }

#BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS #BILLING SERIALIZERS
