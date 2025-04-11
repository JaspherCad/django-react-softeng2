from rest_framework import generics
from rest_framework import status
from django.db import transaction
from .serializers import UserSerializer, PatientSerializer, UserLogSerializer, BillingCreateSerializer, PatientServiceSerializer, BillingItemSerializer, BillingSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Patient, UserLog, Billing, BillingItem
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import HasRole  # Example custom permission
from django.shortcuts import get_object_or_404
from .permissions import IsTeller, IsAdmin, IsDoctor, IsNurse, IsReceptionist  # Use the subclass

from rest_framework.exceptions import (
    APIException,
    AuthenticationFailed,
    PermissionDenied,
    ValidationError,
    NotFound
)


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






####################################################################
# % FOR AUTHENTICATION IN FRONTEND % #
####################################################################



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_check(request):
    """
    Returns the authenticated user's information.
    Expected response:
      {
          "name": <user identifier or full name>,
          "role": <user role>
      }
      AGAIN... FRONTEND PURPOSES
    """
    if not request.user.is_authenticated:
        raise AuthenticationFailed('Authentication credentials were not provided.')
    
    user = request.user 
    return Response({
        "user_id": user.user_id,  
        "role": user.role,
    })

####################################################################
# % FOR AUTHENTICATION IN FRONTEND % #
####################################################################






####################################################################
# % PATIENT VIEWS % #
####################################################################

@api_view(['GET'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def patient_list(request):
    if request.method == "GET":
        try:
            
            #1: go to DATABASE (orm) then FETCH all the object (IN OUR CASE PATIENT)
            list_of_patient = Patient.objects.filter(is_active='Active')

            #2: ok na dito... so we have to SERIALIZE the list_of_patient (PYTHON OBJECT)
            #   into javascript object... how?? look below
            serialized_list_of_patient = PatientSerializer(list_of_patient, many=True)

            
            # Log the action
            

            #3: return the SERIALIZED DATA to frontend as API... or just plain text.
            return Response(serialized_list_of_patient.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": "Something went wrong while fetching patients", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )








@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def patient_create(request):
    if request.method == "POST":
        try:

            #1: since this is request, we recieve API DATA from FRONTEND then "deserialize it"
            patient_serializer = PatientSerializer(data=request.data)

            if not patient_serializer.is_valid():
                raise ValidationError(patient_serializer.errors)# Auto-400 with error details

            if patient_serializer.is_valid():
                patient = patient_serializer.save()
                return Response(patient_serializer.data, status=status.HTTP_201_CREATED)
            
            log_action(
                user=request.user,
                action="CREATE",
                details={
                    "message": "Created a new patient:",
                    "patient_id": patient.id,
                    "patient_name": patient.name
                }
            )

            #fallback
            return Response(patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response(
                {"error": "Something went wrong while fetching patients", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
# { DUMMY DATA TO ""POST"""
#   "name": "John Doe",
#   "date_of_birth": "1990-05-15",
#   "address": "123 Main Street, Springfield",
#   "admission_date": "2023-10-01",
#   "discharge_date": null,
#   "status": "Admitted",
#   "current_condition": "Stable, recovering from surgery",
#   "phone": "+1234567890",
#   "email": "johndoe@example.com",
#   "emergency_contact_name": "Jane Doe",
#   "emergency_contact_phone": "+0987654321",
#   "is_active": "Active"
# }



@api_view(['GET'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def patient_details(request, pk):
    if request.method == "GET":
        try:
           
            patient_detail = Patient.objects.get(pk=pk)

            
            serialized_details = PatientSerializer(patient_detail)

            log_action(
                user=request.user,
                action="VIEW",
                details={
                    "message": "Viewed patient details",
                    "patient_id": patient_detail.id,
                    "patient_name": patient_detail.name
                }
            )

            return Response(serialized_details.data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        
       

@api_view(['PUT'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def patient_update(request, pk):
    if request.method == "PUT":
        try:
            patient = Patient.objects.get(pk=pk)
                                            #send the specific patient then serialize the request.data
            serializer = PatientSerializer(patient, data=request.data, partial=True)

            

            if serializer.is_valid():
                serializer.save()
                log_action(
                    user=request.user,
                    action="UPDATE",
                    details={
                        "message": "Updated patient details",
                        "patient_id": patient.id,
                        "patient_name": patient.name,
                        "updated_fields": list(request.data.keys())
                    }
                )
            return Response(serializer.data, status=status.HTTP_200_OK)
            


        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
       

@api_view(['PUT'])
@permission_classes([IsAdmin])
def patient_deactivate(request, pk):
    if request.method == "PUT":
        patient = Patient.objects.get(pk=pk)

        if patient.is_active == "Inactive":
            return Response({"message": "Patient is already inactive."}, status=status.HTTP_400_BAD_REQUEST)

        patient.deactivate_patient()
        return Response({"message": f"Patient {patient.name} has been deactivated."}, status=status.HTTP_200_OK)

        
    

####################################################################
# % PATIENT VIEWS % #
####################################################################










####################################################################
# % USERLOG VIEWS % #
####################################################################

@api_view(['GET'])
#/<int:pk>
def get_user_logs(request):
    
    if request.method == "GET":

        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)


        #request.user.id
        current_user_log = UserLog.objects.filter(user=request.user).order_by('-timestamp')

        #send to backend by serializing first
        serializer = UserLogSerializer(current_user_log, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

        
    
####################################################################
# % USERLOG VIEWS % #
####################################################################























####################################################################
# % BILLING VIEWS % #
####################################################################

@api_view(['POST'])
@permission_classes([IsAdmin | IsTeller])
def create_billing(request):
    if request.method == "POST":
        with transaction.atomic():
            try:

                # fields = ['patient', 'status']
                serializer = BillingCreateSerializer(data=request.data)
                if serializer.is_valid():
                    billing = serializer.save()
                    log_action(
                    user=request.user,
                    action="CREATE",
                    details={
                        "message": "Created a new billing: " + str(billing.id)
                    }
                    )   
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

            
            except Exception as e:
                return Response(
                    {"error": "Something went wrong while fetching patients", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            

#HYPOTHESIS TODO
# from django.shortcuts import get_object_or_404

# def create_bill_item(request, pk):
#     """
#     Create PatientService first, then link it to a BillingItem.
#     """
#     # Retrieve the existing Billing object
#     billing = get_object_or_404(Billing, id=pk)

#     # Extract required data from the request
#     service = request.data.get('service')
#     price_at_moment = request.data.get('priceAtMoment')
#     quantity = request.data.get('quantity', 1)  # Default quantity is 1

#     # Create PatientService and BillingItem using helper function
#     billing_item = helper_function(billing, service, price_at_moment, quantity)

#     return billing_item


# def helper_function(billing, service, price_at_moment, quantity=1):
#     """
#     Helper function to create PatientService and link it to a BillingItem.
#     """
#     # Create the PatientService instance
#     patient_service = PatientService.objects.create(
#         patient=billing.patient,
#         service=service,
#         quantity=quantity,
#         cost_at_time=price_at_moment
#     )

#     # Create the BillingItem instance linked to the PatientService
#     billing_item = BillingItem.objects.create(
#         billing=billing,
#         service_availed=patient_service  # Use the created PatientService directly
#     )

#     return billing_item



            



#TODO with serializers
# from rest_framework.response import Response
# from rest_framework import status
# from django.shortcuts import get_object_or_404


@api_view(['POST'])
@permission_classes([IsAdmin | IsTeller])
def create_bill_item(request, pk):
    #get billing thru link
    billing = get_object_or_404(Billing, id=pk)

    # Validate PatientService data using the serializer
    #fields = [
        #     'id', 'patient', 'service', 'date_availed', 
        #     'quantity', 'cost_at_time', 'subtotal'
        # ]
        #so only service-ID: quantity: cost_at_time:
    patient_service_data = {
        'patient': billing.patient.id,
        'service': request.data.get('service'),
        'quantity': request.data.get('quantity', 1),
        'cost_at_time': request.data.get('cost_at_time') #if NULL, use default
    }
    patient_service_serializer = PatientServiceSerializer(data=patient_service_data)

    if patient_service_serializer.is_valid():
        patient_service = patient_service_serializer.save()

        # Create BillingItem using the validated PatientService
        billing_item_serializer = BillingItemSerializer(data={
            'billing': billing.id,
            'service_availed': patient_service.id,
            'quantity': request.data.get('quantity', 1),
        })
        if billing_item_serializer.is_valid():
            billing_item = billing_item_serializer.save()
            return Response({'billing_item': billing_item_serializer.data}, status=status.HTTP_201_CREATED)
        return Response(billing_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(patient_service_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def get_bill_items(request):
    #get billing thru link

    try:
        list_of_bills = Billing.objects.prefetch_related('billing_items').all()
        serialized_list_of_bills = BillingSerializer(list_of_bills, many=True)

        return Response(serialized_list_of_bills.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": "Something went wrong while fetching patients", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def get_bill_items_intuition_never_mind_this(request):
    try:
        # Fetch all bills and prefetch their items in 2 queries
        bills = Billing.objects.prefetch_related('billing_items').all()
        
        # Serialize the data
        billing_data = []
        for bill in bills:
            # Access prefetched items (no additional query!)
            items = bill.billing_items.all()
            
            billing_data.append({
                "id": bill.id,
                "patient": bill.patient.id,
                "date_created": bill.date_created,
                "status": bill.status,
                "total_due": bill.total_due,
                "billing_items": [
                    {
                        "id": item.id,
                        "service_availed": item.service_availed_id,
                        "quantity": item.quantity,
                        "subtotal": item.subtotal
                    }
                    for item in items
                ]
            })
        
        return Response(billing_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {"error": "Something went wrong", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
####################################################################
# % BILLING VIEWS % #
####################################################################

#http://127.0.0.1:8000/api/billings/add-billing-item/27
# { dummy input
#     "service-iD": 1,
#     "quantity": 1,
#     "cost_at_time": 9
# }

# http://127.0.0.1:8000/api/billings
# {
#     "patient-iD(from PK)": 5,
#     "status": "Unpaid"
# }
























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

#https://www.django-rest-framework.org/api-guide/permissions/ 
    #@permission_classes([IsAuthenticated])

@api_view(["GET"])
@permission_classes([IsAdmin or IsDoctor or IsNurse or IsReceptionist])  # GROUP BASED PERMISSION (not actual role)
def protected_view(request):
    # Fetch the user with prefetched groups
    user = get_object_or_404(User.objects.prefetch_related('groups'), id=request.user.id)
    user_group = user.groups.first()
    group_name = user_group.name if user_group else "No group assigned"
    return Response({"SUCCESS MSG": f"You are in the {group_name} group."}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsDoctor, IsAdmin])   # GROUP BASED PERMISSION (not actual role)
def doctorOnly(request):
    # Fetch the user with prefetched groups
    user = get_object_or_404(User.objects.prefetch_related('groups'), id=request.user.id)
    user_group = user.groups.first() 
    group_name = user_group.name if user_group else "No group assigned"
    return Response({"SUCCESS MSG": f"You are in the {group_name} group."}, status=status.HTTP_200_OK)


####################################################################
# % API TESTING % #
####################################################################



def log_action(user: User, action: str, details: dict):
    """
    Logs an action performed by a user.
    
    Args:
        user (User): The user performing the action.
        action (str): The type of action (e.g., 'CREATE', 'UPDATE', 'DELETE').
        details (dict): Additional context about the action.
    """
    UserLog.objects.create(
        user=user,
        action=action,
        details=details
    )

