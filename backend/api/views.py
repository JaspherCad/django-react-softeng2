from rest_framework import generics
from rest_framework import status

from .serializers import UserSerializer, PatientSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Patient
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import HasRole  # Example custom permission
from django.shortcuts import get_object_or_404
from .permissions import IsTeller, IsAdmin, IsDoctor, IsNurse, IsReceptionist  # Use the subclass



# WHEN TO USE PREFETCH
# Use prefetch_related when accessing related objects (many-to-many or reverse foreign key relationships) to optimize database queries.
# Apply it in views where related objects are accessed repeatedly or in loops.
# Skip prefetch_related for simple queries or when related objects are not needed.

#Example
# users = User.objects.all()
# for user in users:
#     print(user.groups.all())  # This triggers an extra query for each user!

#VS

# users = User.objects.prefetch_related("groups")
# for user in users:
#     print(user.groups.all())  # No extra queries!














# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



# api/views.py

from django.http import HttpResponse

def about(request):
    return HttpResponse("This is the ABOUT page.")
    
####################################################################
# % API TESTING % #
####################################################################


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsTeller])  # GROUP BASED PERMISSION (not actual role)
def protected_view(request):
    # Fetch the user with prefetched groups
    user = get_object_or_404(User.objects.prefetch_related('groups'), id=request.user.id)
    user_group = user.groups.first()
    group_name = user_group.name if user_group else "No group assigned"
    return Response({"SUCCESS MSG": f"You are in the {group_name} group."}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsDoctor])   # GROUP BASED PERMISSION (not actual role)
def doctorOnly(request):
    # Fetch the user with prefetched groups
    user = get_object_or_404(User.objects.prefetch_related('groups'), id=request.user.id)
    user_group = user.groups.first() 
    group_name = user_group.name if user_group else "No group assigned"
    return Response({"SUCCESS MSG": f"You are in the {group_name} group."}, status=status.HTTP_200_OK)


####################################################################
# % API TESTING % #
####################################################################








####################################################################
# % PATIENT VIEWS % #
####################################################################


@api_view(['GET', 'POST'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def patient_list_create(request):#we can do GET list and POST create
    if request.method == "GET":
        #get object all
        list_of_patients = Patient.objects.filter(is_active='Active')
        #serialiez it 
        serialized_data = PatientSerializer(list_of_patients, many=True)
        #return Response
        return Response(serialized_data.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        patient_serializer = PatientSerializer(data=request.data) #from JSON --- PYTON OBJ
        if patient_serializer.is_valid():
            patient_serializer.save()
            return Response(patient_serializer.data, status=status.HTTP_201_CREATED)
        return Response(patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# GET, UPDATE, DELETE a single patient
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdmin | IsDoctor | IsNurse])
def patient_detail(request, pk):
    patient = get_object_or_404(Patient, pk=pk)

    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        patient.is_active = 'Deleted'
        patient.save()
        return Response({'message': 'Patient marked as deleted'}, status=status.HTTP_204_NO_CONTENT)

####################################################################
# % PATIENT VIEWS % #
####################################################################