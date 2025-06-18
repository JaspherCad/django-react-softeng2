from django.utils import timezone
import json
from rest_framework import generics
from rest_framework import status
from django.db import transaction
from django.db.models import Q
from django.contrib.auth.models import Group, Permission

from .serializers import ClinicalNoteSerializer, GroupPermissionUpdateSerializer, GroupSerializer, PatientHistorySerializer, UserImageSerializer, UserSerializer, PatientSerializer, UserLogSerializer, BillingCreateSerializer, ServiceSerializer, PatientServiceSerializer, LaboratoryResultSerializer, LabResultFileSerializer, BillingItemSerializer, BillingSerializer, BillingSerializerNoList, Billing_PatientInfo_Serializer, LabResultFileGroupSerializer, LabResultFileInGroup, LabResultFileInGroupSerializer, RoomWithBedInfoSerializer, BedAssignmentSerializer, UserCreateSerializer
from django.contrib.auth.hashers import make_password

from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ClinicalNote, User, LabResultFileGroup, LabResultFileInGroup ,Patient, UserLog, Billing, BillingItem, BillingOperatorLog, PatientService, Service, LaboratoryResult, LabResultFile, Bed, BedAssignment, Room
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import HasRole  # Example custom permission
from django.shortcuts import get_object_or_404
from .permissions import IsTeller, IsAdmin, IsDoctor, IsNurse, IsReceptionist  # Use the subclass
from rest_framework.pagination import PageNumberPagination

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
            list_of_patient_query = Patient.objects.filter(is_active='Active').order_by('-admission_date')

            #Initialize paginator
            paginator = PageNumberPagination()
            paginator.page_size = 2


            #paginate queryset
            page = paginator.paginate_queryset(list_of_patient_query, request)

            #2: ok na dito... so we have to SERIALIZE the list_of_patient (PYTHON OBJECT)
            #   into javascript object... how?? look below


            #serialize paginated data
            if page is not None:
                serialized_list_of_patient = PatientSerializer(page, many=True)
                return paginator.get_paginated_response(serialized_list_of_patient.data)


            

            
            # Log the action (automatic sa triggers)
            

            
            #basecase// if pagination fails ()=> return normal querySet
            serializer = BillingSerializerNoList(list_of_patient_query, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": "Something went wrong while fetching patients", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


























# CLINICAL NOTES # CLINICAL NOTES# CLINICAL NOTES# CLINICAL NOTES# CLINICAL NOTES# CLINICAL NOTES
@api_view(['GET'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def get_clinical_notes_by_code(request, case_number):

    # Retrieve all clinical notes for a patient identified by its case_number.
    
    notes = ClinicalNote.objects.filter(patient__case_number=case_number)
    serializer = ClinicalNoteSerializer(notes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def create_clinical_note(request, case_number):
    
    #POST  a new clinical note for the patient identified by case_number.
    #Expected JSON body matches ClinicalNoteSerializer fields (excluding patient).
    
    patient = get_object_or_404(Patient, case_number=case_number)
    data = request.data.copy()
    data['patient'] = patient.id

    serializer = ClinicalNoteSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def get_clinical_notes_by_patient(request, patient_id):
    notes = ClinicalNote.objects.filter(patient_id=patient_id)
    serializer = ClinicalNoteSerializer(notes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



# CLINICAL NOTES # CLINICAL NOTES# CLINICAL NOTES# CLINICAL NOTES# CLINICAL NOTES# CLINICAL NOTES

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
                patient_serializer.is_valid(raise_exception=True)
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
                serializer.save(_history_user=request.user)
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
        



@api_view(['GET'])
@permission_classes([IsAdmin | IsDoctor | IsNurse | IsReceptionist])
def patient_history(request, pk):
    if request.method == "GET":
        try:
            patient = Patient.objects.get(pk=pk)
            history_records = patient.history.all().select_related('history_user')
            
            serializer = PatientHistorySerializer(history_records, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Patient.DoesNotExist:
            return Response(
                {"error": "Patient not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Something went wrong while fetching patient history", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



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
 # {
    #   "patient": 1,
    #   "status": "Unpaid"
    # }

def create_billing(request):
    patient_id = request.data.get('patient')
    if patient_id is None:
        return Response(
            {"patient": ["This field is required."]},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        patient_id = int(patient_id)
    except (TypeError, ValueError):
        return Response(
            {"patient": ["A valid integer is required."]},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not Patient.objects.filter(pk=patient_id).exists():
        print("HERE?")
        return Response(
            {"patient": f"Patient with id {patient_id} does not exist."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    

    try:
        with transaction.atomic():
            serializer = BillingCreateSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            billing = serializer.save(created_by=request.user)

            #add creator to operator
            billing.operator.add(request.user)
            log_action(
                user=request.user,
                action="CREATE",
                details={"message": f"Created a new billing: {billing.id}"}
            )

            #billing log the action for security purposes
            BillingOperatorLog.objects.create(
                billing=billing,
                user=request.user,
                action="Bill Created"
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as exc:
        # Catch everything else
        return Response(
            {"error": "Something went wrong", "details": str(exc)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAdmin | IsTeller])
def mark_billing_paid(request, billing_code):
    billing = get_object_or_404(Billing, code=billing_code)
    
    if billing.status == 'Paid':
        return Response(
            {"error": "This bill is already marked as paid"},
            status=status.HTTP_400_BAD_REQUEST
        )

    billing.status = 'Paid'
    billing.save(update_fields=['status'])


    user = request.user
    if user and user.is_authenticated:
        #Add operator if not already present
        if not billing.operator.filter(id=user.id).exists():
            billing.operator.add(user)

        #log action
        BillingOperatorLog.objects.create(
            billing=billing,
            user=user,
            action="Marked as Paid"
        )

    return Response({
        "message": "Billing marked as paid",
        "billing_code": billing.code,
        "total_due": billing.total_due
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdmin | IsTeller])
def update_billing(request, pk):
    billing = get_object_or_404(Billing, id=pk)

    serializer = BillingCreateSerializer(billing, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    serializer.save()

    if not billing.operator.filter(id=request.user.id).exists():
        billing.operator.add(request.user)

    BillingOperatorLog.objects.create(
        billing=billing,
        user=request.user,
        action="Bill Updated"
    )

    return Response(serializer.data)





    #                             #id of that PATIENT
    # path('billings/add-billing-item/<int:pk>', views.create_bill_item, name='create_billing_item'),

@api_view(['PUT'])
@permission_classes([IsAdmin | IsTeller])
def edit_bill_item(request, billing_pk, item_pk):

    #get the parent Billing
    billing = get_object_or_404(Billing, code=billing_pk)

    #STRICT! only BillingItem that belongs to that Billing
    billing_item = get_object_or_404(BillingItem, id=item_pk, billing=billing)

    #build or reuse patientService record
    service_id = request.data.get('service')
    quantity = request.data.get('quantity', 1)
    cost_at_time = request.data.get('cost_at_time')

    if service_id is None or cost_at_time is None:
        return Response(
            {"detail": "Both 'service' and 'cost_at_time' are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    existing_patient_service = PatientService.objects.filter(
        patient=billing.patient,
        service__id=service_id,
        quantity=quantity,
        cost_at_time=cost_at_time
        ).first()
    


    #use existing or build new one... save data baka i deploy aws
    
    if existing_patient_service:
        patient_service = existing_patient_service
    else:
                # SAMPLE DATA INPUT
                #  "service": 1,
                #  "quantity": 1,
                #  "cost_at_time": 2000


        # iff theres a PatientService for (patient, service) but different qty/cost
        conflict = PatientService.objects.filter(
            patient=billing.patient,
            service__id=service_id
        ).first()

        if conflict:
            # update the existing conflict record to the new qty & cost
            conflict.quantity = quantity
            conflict.cost_at_time = cost_at_time
            conflict.save()
            patient_service = conflict
        else:
            #Else, create a new PatientService
            patient_Service_data = {
                'patient': billing.patient.id,
                'service': service_id,
                'quantity': quantity,
                'cost_at_time': cost_at_time
            }
            patient_service_serializer = PatientServiceSerializer(data=patient_Service_data)
            if not patient_service_serializer.is_valid():
                return Response(patient_service_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            patient_service = patient_service_serializer.save()


    #update the BillingItem to point to this PatientService
    billing_item.service_availed = patient_service
    # PS: quantity and subtotal on BillingItem are recalculated in BillingItem.save()
    billing_item.save()

    serializer = BillingItemSerializer(billing_item)
    return Response(serializer.data, status=status.HTTP_200_OK)
    


@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def get_bill_item(request, billing_pk, item_pk):
    """
    Retrieve a single BillingItem that belongs to a specific Billing.
    URL: GET /api/billings/{billing_pk}/items/{item_pk}/edit
    """
    # 1) Fetch the parent Billing by its ID (billing_pk)
    billing = get_object_or_404(Billing, code=billing_pk)

    # 2) Fetch the BillingItem only if it belongs to that Billing
    billing_item = get_object_or_404(BillingItem, id=item_pk, billing=billing)

    # 3) Serialize and return
    serializer = BillingItemSerializer(billing_item)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdmin | IsTeller])
def create_bill_item(request, pk):
    #get billing thru link
    billing = get_object_or_404(Billing, id=pk)
    #create billing item's patient_service data
    patient_service_data = {
        #get the patient id thru URL bcoz url say add billing item to BILL #pk
        'patient': billing.patient.id,
        'service': request.data.get('service'),
        'quantity': request.data.get('quantity', 1),
        'cost_at_time': request.data.get('cost_at_time') #if NULL, use default
    }
    patient_service_serializer = PatientServiceSerializer(data=patient_service_data)


    #SAVING THE PATIENTSERVICE HERE>.... dont turn into function, i want to see step by step

    #if valid => save then continue the creation of billing item... then service availed === patient_service_serializer

    existing_patient_service = PatientService.objects.filter(
            patient=billing.patient,
            service=request.data.get('service'),
            quantity=request.data.get('quantity', 1),
            cost_at_time=request.data.get('cost_at_time')
        ).first()
        


    
    if patient_service_serializer.is_valid():
        
        if existing_patient_service:
            patient_service = existing_patient_service
        else:
            patient_service = patient_service_serializer.save()
        
  
            #get that patient_service 's id then save as patient_service
            #BY findByPatient, findByService, findBy... if those matches get that patient_service data... then use it rather creating new again



        # Create BillingItem using the validated PatientService
        billing_item_serializer = BillingItemSerializer(data={
            'billing': billing.id,
            'service_availed': patient_service.id, #this.id ==> can be newly created or the existing ones (review ^)
            'quantity': request.data.get('quantity', 1),
        })
        if billing_item_serializer.is_valid():
            billing_item = billing_item_serializer.save()
            return Response({'billing_item': billing_item_serializer.data}, status=status.HTTP_201_CREATED)
        return Response(billing_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(patient_service_serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@api_view(['GET'])
@permission_classes([IsAdmin | IsAuthenticated])
def search_service(request):
    query = request.query_params.get('q', '').strip()
    if not query:
        
        return Response([], status=status.HTTP_200_OK)
    
    try:
        services = Service.objects.filter(
            Q(name__icontains=query)
        )[:10] 

        serializer = ServiceSerializer(services, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)

        return Response(
            {"error": "Something went wrong while searching patients", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


     



@api_view(['GET'])
@permission_classes([IsAdmin | IsAuthenticated])
def search_patients(request):

    query = request.query_params.get('q', '').strip()
    if not query:
        
        return Response([], status=status.HTTP_200_OK)
    
    try:
        
        
        bills = Patient.objects.filter(
            Q(code__icontains=query) |
            Q(name__icontains=query) 
        )[:5] 
        serializer = PatientSerializer(bills, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)

        return Response(
            {"error": "Something went wrong while searching patients", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )





@api_view(['GET'])
@permission_classes([IsAdmin | IsAuthenticated])
def search_users(request):
    q = request.query_params.get('q', '').strip()
    if not q:
        return Response([], status=status.HTTP_200_OK)

    try:
        qs = User.objects.filter(
            Q(user_id__icontains=q) |
            Q(role__icontains=q) |
            Q(department__icontains=q)
        )[:5]
        serializer = UserSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "Something went wrong while searching users", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def search_billings(request):
    """
    Search billings using a query parameter 'q'. Returns up to 20 matched results.
    
    Example request: GET /api/billings/search?q=john
    """
    query = request.query_params.get('q', '').strip()
    if not query:
        # If no search query is provided, you can return an empty list or all records.
        # Here we choose to return an empty array.
        return Response([], status=status.HTTP_200_OK)
    
    try:
        # Use Q objects to search multiple fields.
        # Adjust the fields and lookups as necessary:
        
        bills = Billing.objects.filter(
            Q(patient__name__icontains=query) |
            Q(patient__code__icontains=query) |

            Q(code__icontains=query) |

            Q(status__icontains=query)
            
            # You can add more fields here, e.g.:
            # | Q(total_due__icontains=query)
        )[:20]  # Limit to 20 results
        serializer = BillingSerializerNoList(bills, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)

        return Response(
            {"error": "Something went wrong while searching bills", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller]) 
def get_billing_item(request, pk):
    
    
    try:
        billing_item = BillingItem.objects.filter(id=pk).first()

        serialized_billing_item = BillingItemSerializer(billing_item)

        return Response(serialized_billing_item.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": "Something went wrong while fetching billing_item", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    







#PAGINATION FORMAT SAMPLE
@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def get_bills(request):
#   /api/billings/list
#   /api/billings/list?page=2
    try:
        #get base queryset
        queryset = Billing.objects.all().order_by('-date_created')
        
        #Initialize paginator
        paginator = PageNumberPagination()
        paginator.page_size = 3
        
        #paginate queryset
        page = paginator.paginate_queryset(queryset, request)
        
        #serialize paginated data
        if page is not None:
            serializer = BillingSerializerNoList(page, many=True)
            return paginator.get_paginated_response(serializer.data)
            
        #basecase// if pagination fails ()=> return normal querySet
        serializer = BillingSerializerNoList(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
                            #   /api/billings/list
                            #   /api/billings/list?page=2   
    except Exception as e:
        return Response(
            {"error": "Something went wrong while fetching bills", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def get_bills_with_bill_items(request):
    try:
        bills_queryset = Billing.objects.prefetch_related('billing_items').all().order_by('-date_created')

        #Initialize paginator
        paginator = PageNumberPagination()
        default_page_size = 3
        page_size_param = request.query_params.get('pageSize')


        if page_size_param:
            try:
                #pageSize to an integer then lower bound check
                parsed_page_size = int(page_size_param)
                if parsed_page_size > 0:
                    paginator.page_size = parsed_page_size
                else:
                    paginator.page_size = default_page_size
            except ValueError:
                paginator.page_size = default_page_size
        else:
            paginator.page_size = default_page_size

        
        #paginate queryset
        page = paginator.paginate_queryset(bills_queryset, request)


        #serialize paginated data
        if page is not None:
            serializer = BillingSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)


        #basecase// if pagination fails ()=> return normal querySet

        serializer = BillingSerializer(bills_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "Something went wrong while fetching bills", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    #develop

@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def get_bills_by_id_with_bill_items(request, pk):
    try:
                #get specific billing record by ID
        # bill = Billing.objects.prefetch_related('billing_items').filter(id=pk).first() //not sure if keep or remove this line

        bill = Billing.objects.filter(code=pk).first()


        if not bill:
            #get all existing Billing codes as return coz its confusing me.. id!=billing_code
            available_codes = list(
                Billing.objects
                       .order_by('code')
                       .values_list('code', flat=True)
            )

            return Response(
                {
                    "error": f"Billing record with code '{pk}' not found.",
                    "available_codes": available_codes
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # If found, serialize and return.
        serializer = Billing_PatientInfo_Serializer(bill)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {
                "error": "Something went wrong while fetching bills.",
                "details": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    


@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def get_bills_by_ACTUAL_id_with_bill_items(request, pk):
    try:
                #get specific billing record by ID
        # bill = Billing.objects.prefetch_related('billing_items').filter(id=pk).first() //not sure if keep or remove this line

        bill = Billing.objects.filter(id=pk).first()


        if not bill:
            #get all existing Billing codes as return coz its confusing me.. id!=billing_code
            available_codes = list(
                Billing.objects
                       .order_by('code')
                       .values_list('code', flat=True)
            )

            return Response(
                {
                    "error": f"Billing record with code '{pk}' not found.",
                    "available_codes": available_codes
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # If found, serialize and return.
        serializer = Billing_PatientInfo_Serializer(bill)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {
                "error": "Something went wrong while fetching bills.",
                "details": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    
@api_view(['POST'])
@permission_classes([IsAdmin | IsTeller])
def create_bills(request):
   

    try:
        #send the request.data in serializer data = request.data
        serializer = BillingSerializer(data = request.data) #if failed, try BillingSerializerNoList
        #if valid save
        if serializer.is_valid():
            billing = serializer.save()
            return Response(BillingSerializerNoList(billing).data, status=status.HTTP_201_CREATED)
        #outside if return FALSE statements
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
    except Exception as e:
        return Response(
            {"error": "Something went wrong while creating the billing record", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )










@api_view(['GET'])
@permission_classes([IsAdmin | IsTeller])
def get_bill_items_intuition_never_mind_this(request):
    try:
        # Fetch all bills and prefetch their items in 2 queries
        bills = Billing.objects.prefetch_related('billing_items').all()
        
        # Serialize the data

        #create a list of data
        data = []

        #use for loop to loop the LIST OF BILLS FROM MODEL
        for bill in bills:
                    #create a object key-value pair billData = { id:bills.id etc }

            billData = {
                "id":bill.id,
                "patient":str(bill.patientName),
                "next" : "... etc"
            }

            for item in bill.item.all():
                itemData = {
                    "id":item.id
                }
                billData['billing_item'].append(itemData)

        data.append(billData)


        
        #now for the list_of_bills attribute we have loop the LIST OF BILLS.BILLITEMS so..

        #for items in LIST OF BILLS.BILLITEMS
        #key value pair itemData ={id: item.id}

        #inside loop get the billdata then append the itemData in billdata['items'] : itemData (list ito)
        billing_data = []
        for bill in bills:
           return 1
        
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



#--------------Laboratory Views----------
#--------------Laboratory Views----------
#--------------Laboratory Views----------
#--------------Laboratory Views----------
#--------------Laboratory Views----------

#-Laboratory has lists of lab results (can be pdf, note, img)

#-MANY lab to ONE patient
#-MANY lab(result file) to ONE LAB



#Laboratory Views


@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor])
def create_laboratory_result_for_patient(request, pk):
   

    try:
        patient = get_object_or_404(Patient, id=pk)
        

        lab_data = {
            'patient': patient.id,
            'test_type': request.data.get('test_type'),
            'result_summary': request.data.get('result_summary')
            
        }




        serializer = LaboratoryResultSerializer(data = lab_data) 




        if serializer.is_valid():
            lab_result = serializer.save(performed_by=request.user)
            return Response(LaboratoryResultSerializer(lab_result).data, status=status.HTTP_201_CREATED)
        #outside if return FALSE statements
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
    except Exception as e:
        return Response(
            {"error": "Something went wrong while creating the LAB record", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



#Laboratory Views
@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor])
def create_laboratory_file_result_for_laboratory_class(request, pk):
    # - file: <binary file>
    # - description: optional text
    # update: MultipleFile upload

    try:
        lab_result = get_object_or_404(LaboratoryResult, id=pk)
        upload_list = request.FILES.getlist('file')

        if not upload_list:
            return Response(
                {"detail": "No files were provided under key 'file'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        #return this at end
        
        errors = []
        
        descriptions = request.data.getlist('description', [])

        valid_serializers = []

        for i, upload in enumerate(upload_list):
            
            description = descriptions[i] if i < len(descriptions) else request.data.get('description', '')
            
            data = {
                'file': upload,
                'description': description
            }

            #validate the nsav


            serializer = LabResultFileSerializer(data=data, context={'request': request})

            #PRE VALIDATION before saving.. stop process if something not valid
            if not serializer.is_valid():
                # Immediately stop processing and return error response
                return Response(
                    {"errors": {f"file_{i+1}": serializer.errors}},
                    status=status.HTTP_400_BAD_REQUEST
                )




            if serializer.is_valid():
                valid_serializers.append(serializer)
                #SAVE ON ANOTHER LOOP LATER
                #serializer.save(result=lab_result, uploaded_by=request.user)
            #     results.append(serializer.data)
            # else:
            #     errors.append(serializer.errors)

            # if errors:
            #     return Response({
            #         "success": results,
            #         "errors": errors
            #     }, status=status.HTTP_400_BAD_REQUEST)
            
        results = []



        # @atomic transaction if something fails during saving,
        #no files are committed

        with transaction.atomic():
            for serializer in valid_serializers:
                instance = serializer.save(result=lab_result, uploaded_by=request.user)
                results.append(LabResultFileSerializer(instance, context={'request': request}).data)
        
        return Response(results, status=status.HTTP_201_CREATED)

    
    except Exception as e:
        return Response(
            {"error": "Something went wrong while creating the LAB record", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




    





#Laboratory Views




@api_view(['GET'])
@permission_classes([IsAdmin | IsAuthenticated])
def search_labId(request):
    query = request.query_params.get('q', '').strip()
    if not query:
        
        return Response([], status=status.HTTP_200_OK)
    
    try:
        laboratory = LaboratoryResult.objects.filter(
            Q(id__icontains=query) | 
            Q(code__icontains=query) | 
            Q(patient__name__icontains=query) | 
            Q(patient__code__icontains=query) |
            Q(result_summary__icontains=query)
        )[:10] 

        serializer = LaboratoryResultSerializer(laboratory, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)

        return Response(
            {"error": "Something went wrong while searching patients", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )





@api_view(['GET'])
@permission_classes([IsAdmin | IsDoctor])
def get_laboratory_by_id(request, pk):
    try:
        # Get the laboratory result with related files in a single query
        lab_result = LaboratoryResult.objects.prefetch_related('attachments', 'file_groups__files').get(id=pk)
        
        # Serialize main laboratory result
        lab_serializer = LaboratoryResultSerializer(lab_result)
        
        # files = LabResultFile.objects.filter(result=lab_result)
        # file_serializer = LabResultFileSerializer(files, many=True, context={'request': request})
        
        # response_data = {
        #     'laboratory_result': lab_serializer.data,
        #     'associated_files': file_serializer.data,
        #     'files_count': files.count(),
        #     'performed_by': str(lab_result.performed_by),
        #     'status': 'success'
        # }
        
        return Response(lab_serializer.data, status=status.HTTP_200_OK)
        
    except LaboratoryResult.DoesNotExist:
        return Response(
            {"error": "Laboratory result not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": "Failed to retrieve laboratory details", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )





#GROUP UPLAOD FILES to an EXISTING LABORATORY   

@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor])
def create_laboratory_file_group(request, labId):
    try:
        
        lab_result = get_object_or_404(LaboratoryResult, id=labId)
        description = request.data.get('description', '')
        file_count = int(request.data.get('file_count', 0))
        files = request.FILES.getlist('files')

       
        if not files:
            return Response(
                {"error": "No files were provided under key 'files'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if file_count <= 0:
            return Response(
                {"error": "'file_count' must be a positive integer"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(files) != file_count:
            return Response(
                {
                    "error": f"Mismatch between file count: expected {file_count}, got {len(files)}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        #reate one group
        with transaction.atomic():
            group = LabResultFileGroup.objects.create(
                result=lab_result,
                description=description,
                uploaded_by=request.user
            )
        #add file_count to model to loop thru it... idk required di ko magawa by size of inputs

            group_files = []
            for i in range(file_count):
                file = files[i]
                #LabResultFileInGroup == <what group | the file itself>
                lab_file = LabResultFileInGroup.objects.create(
                    group=group,
                    file=file
                )
                group_files.append(lab_file)

        return Response({
            "group": LabResultFileGroupSerializer(group).data,
            "files": LabResultFileInGroupSerializer(group_files, many=True).data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": "Something went wrong while uploading files", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['GET'])
@permission_classes([IsAdmin | IsDoctor])
def get_laboratory_file_group(request, group_id):
    """
    Retrieve a specific LabResultFileGroup by ID, including its files.
    """
    try:
        # Fetch the group or return 404
        group = get_object_or_404(LabResultFileGroup, id=group_id)

        # Serialize the group with its files
        serializer = LabResultFileGroupSerializer(group)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Failed to retrieve file group", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

# views.py

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes

@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor])
@parser_classes([MultiPartParser, FormParser])
def upload_user_image(request, user_id):
    """
    Upload one or more images to a User.
    URL: /api/user/<user_id>/upload-image/
    """
    user = get_object_or_404(User, id=user_id)

    upload_list = request.FILES.getlist('file')
    if not upload_list:
        return Response(
            {"error": "No files were provided under key 'file'."},
            status=status.HTTP_400_BAD_REQUEST
        )

    descriptions = request.data.getlist('description', [])
    valid_serializers = []

    for i, upload in enumerate(upload_list):
        description = descriptions[i] if i < len(descriptions) else request.data.get('description', '')

        data = {
            'file': upload,
            'description': description
        }

        serializer = UserImageSerializer(data=data, context={'request': request})
        if not serializer.is_valid():
            return Response(
                {"error": f"Error in file {i+1}", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        valid_serializers.append(serializer)

    try:
        results = []
        with transaction.atomic():
            for serializer in valid_serializers:
                instance = serializer.save(user=user, uploaded_by=request.user)
                results.append(UserImageSerializer(instance).data)

        return Response(results, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": "Failed to upload images", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_server_time(request):
    try:
        server_time = timezone.now().isoformat()
        return Response({'server_time': server_time}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "Failed to retrieve server time", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )





#on EDIT lab
#we can edit the TEST TYPE && RESULT SUMMARY

#on EDIT lab files (group new update)
#we cant edit files, only DELETE and ADD more









@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor])
def assign_bed(request, patient_id, bed_id, billing_id):
    patient = get_object_or_404(Patient, id=patient_id)
    bed = get_object_or_404(Bed, id=bed_id)
    billing = get_object_or_404(Billing, id=billing_id)
    
    # Ensure billing belongs to the patient
    if billing.patient.id != patient.id:
        return Response(
            {"error": f"Billing ID {billing.id} does not belong to Patient {patient.id}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    #base case revised
    if patient.status != 'Admitted':
        return Response(
            {"error": "Only admitted patients can be assigned a bed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    
        
    assignment = BedAssignment.objects.create(
        patient=patient,
        bed=bed,
        assigned_by=request.user,
        billing=billing  
    )
    bed.is_occupied = True
    bed.save()


    return Response({
        "id": assignment.id,
        "patient": {
            "id": patient.id,
            "name": patient.name
        },
        "bed": {
            "id": bed.id,
            "number": bed.number
        },
        "start_time": assignment.start_time
    }, status=status.HTTP_201_CREATED)








@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor])
def add_laboratory_file_group_to_existing_lab(request, labId):
    return None




# views.py
@api_view(['POST'])
@permission_classes([IsAdmin | IsDoctor])
def discharge_patient(request, patient_id):
    patient = get_object_or_404(Patient, id=patient_id)
    assignment = patient.bed_assignments.filter(end_time__isnull=True).first()

    if not assignment:
        return Response(
            {"error": "No active bed assignment found"},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        #NOTE: goal is to put end_time value,, if end_time the tasks.py stops hrly incremental
        # Set end_time
        assignment.end_time = timezone.now()
        assignment.save(update_fields=['end_time'])

        #note to anyone: THIS IS JUST LIKE A BASE
        # create billing but only when there are unbilled minutes/hours at the time of discharge.
        assignment.create_final_billing_item()

        # Mark patient as discharged
        patient.status = 'Discharged'
        patient.save()

        # Free up bed
        bed = assignment.bed
        bed.is_occupied = False
        bed.save()

        return Response({
            "message": "Patient discharged successfully",
            "final_hours": assignment.get_current_hours() - assignment.total_hours,
            "billing_id": assignment.billing.id if assignment.billing else None
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Failed to discharge patient", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



# @api_view(['POST'])
# @permission_classes([IsAdmin | IsDoctor])
# def discharge_patient(request, patient_id):
#     patient = get_object_or_404(Patient, id=patient_id)
#     assignment = BedAssignment.objects.filter(patient=patient, end_time__isnull=True).first()

#     if not assignment:
#         return Response(
#             {"error": "No active bed assignment found for this patient"},
#             status=status.HTTP_404_NOT_FOUND
#         )

#     hours_to_bill = assignment.get_current_minutes() - assignment.total_hours
#     if hours_to_bill >= 1:
#         assignment.create_billing_item(hours_to_bill)

#     assignment.end_time = timezone.now()
#     assignment.save(update_fields=['end_time'])

#     patient.status = 'Discharged'
#     patient.save()

#     return Response({
#         "message": "Patient discharged successfully",
#         "final_hours": hours_to_bill,
#         "total_billed": hours_to_bill * assignment.bed.room.hourly_rate
#     }, status=status.HTTP_200_OK)


# @api_view(['POST'])
# @permission_classes([IsAdmin | IsDoctor])
# def trigger_billing_task(request):
#     generate_hourly_besd_chargess()  # Manually run the task
#     return Response({"message": "Billing task executed"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated | IsAdmin])
def room_bed_list(request):
    rooms = Room.objects.prefetch_related('bed_set').all()
    serializer = RoomWithBedInfoSerializer(rooms, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bed_assignment_list(request):

    #optional param active
      #active=true  → only assignments with end_time == null
      #active=false → only assignments with end_time != null
    active_q = request.query_params.get('active')
    qs = BedAssignment.objects.select_related('bed', 'patient', 'billing', 'assigned_by')

    #conditional render base case   
    if active_q is not None: 
        if active_q.lower() in ('true', '1', 'yes'):
            qs = qs.filter(end_time__isnull=True)
        elif active_q.lower() in ('false', '0', 'no'):
            qs = qs.filter(end_time__isnull=False)
        else:
            return Response(
                {"error": "Invalid value for 'active'; use true or false."},
                status=status.HTTP_400_BAD_REQUEST
            )

    #all
    serializer = BedAssignmentSerializer(qs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    
from rest_framework.views import APIView

#CUSTOM USER CREATION
class UserCreateView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        try:
            with transaction.atomic():
                data = request.data.copy()
                
                # Hash password
                if 'password' in data:
                    data['password'] = make_password(data['password'])

                # Handle groups and permissions
                group_ids = data.pop('groups', [])
                permission_ids = data.pop('user_permissions', [])

                # Create user
                serializer = UserCreateSerializer(data=data)
                if not serializer.is_valid():
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                user = serializer.save()

                # Assign groups
                if group_ids:
                    groups = Group.objects.filter(id__in=group_ids)
                    user.groups.set(groups)

                # Assign permissions
                if permission_ids:
                    permissions = Permission.objects.filter(id__in=permission_ids)
                    user.user_permissions.set(permissions)

                return Response(UserCreateSerializer(user).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": "Failed to create user", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# api/views.py

from django.http import HttpResponse

def about(request):
    return HttpResponse("This is the ABOUT page.")
    

#IDK BATTERY INCLUDED TO!

class GroupListCreateView(generics.ListCreateAPIView):
    """
    GET /api/groups/ - List all groups
    POST /api/groups/ - Create new group
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdmin]


class GroupPermissionUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET /api/groups/<group_id>/permissions/ - Get group details with permissions
    PUT /api/groups/<group_id>/permissions/ - Update group permissions
    """
    queryset = Group.objects.all()
    serializer_class = GroupPermissionUpdateSerializer
    permission_classes = [IsAdmin]
    lookup_url_kwarg = 'group_id'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'GET':
            context.update({
                "permissions": Permission.objects.all()
            })
        return context


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

####################################################################
# % ADMIN PANEL % #
####################################################################

def is_admin(user):
    return user.role == 'Admin'


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    """List all users or create a new one"""
    if not is_admin(request.user):
        return Response({"error": "Only administrators can manage users"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        users = User.objects.all().prefetch_related('groups')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    

#USER CRAETION AT urls.py
    # path('user/register', views.CreateUserView.as_view(), name='register'),
    # path('user/login', TokenObtainPairView.as_view(), name='login'),

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, pk):
    """Retrieve, update or delete a user"""
    if not is_admin(request.user):
        return Response({"error": "Only administrators can manage users"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.prefetch_related('groups').get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if user == request.user:
            return Response({"error": "Cannot delete self"}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = False
        user.save()
        return Response({"message": "User deactivated successfully"}, status=status.HTTP_204_NO_CONTENT)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_roles(request):
    if not is_admin(request.user):
        return Response({"error": "Only administrators can access role information"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    return Response(dict(User.ROLE_CHOICES))
####################################################################
# % ADMIN PANEL % #
####################################################################
