from rest_framework import serializers
from .models import User, Patient, LaboratoryResult, LabResultFile # Import your custom User model

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




class LabResultFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResultFile
        fields = ['id', 'file', 'description']

class LaboratoryResultSerializer(serializers.ModelSerializer):
    attachments = LabResultFileSerializer(many=True, read_only=True)  # For displaying uploaded files

    class Meta:
        model = LaboratoryResult
        fields = ['id', 'patient', 'test_type', 'result_summary', 'date_performed', 'performed_by', 'attachments']

#save state save stat eito hahaha 123 