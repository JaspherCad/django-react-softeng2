import pytest
from django.urls import reverse
from django.contrib.auth.models import Group

@pytest.mark.django_db
def test_protected_endpoint(client, django_user_model):
    #create a user

    test_user = django_user_model.objects.create_user(
        user_id='testuser',
        password='secret',
        role='Doctor',
        department='Testing'
        
    )
    #add the new user to a certain django group
    
    doctor_group, created = Group.objects.get_or_create(name='Doctor')
    if doctor_group not in test_user.groups.all():
        test_user.groups.add(doctor_group)


    test_user.is_staff = True
    test_user.save()


    test_user.refresh_from_db()  # Refresh from DB to get latest changes
    assert doctor_group in test_user.groups.all()

    #login with cred
    token_url = reverse('login')
    token_response = client.post(token_url, data = {
        "user_id": "testuser",
        "password": "secret"
    }, content_type='application/json')

    assert token_response.status_code == 200
    


    #reponse.get[access] 
    token = token_response.json().get("access")
    assert token is not None
    
    #access endpoint
    target_url = reverse('patient_list')
    response = client.get(target_url, HTTP_AUTHORIZATION=f'Bearer {token}')
    

    assert response.status_code == 200
    #assert status 200


@pytest.mark.django_db
def test_add_patient(client, django_user_model):
    #create user
    test_user = django_user_model.objects.create_user(
        user_id='testuser',
        password='secret',
        role='Doctor',
        department='Testing'
        
    )
    #add the new user to a certain django group
    #Important: add the created user to a a proper group

    doctor_group, created = Group.objects.get_or_create(name='Doctor')
    if doctor_group not in test_user.groups.all():
        test_user.groups.add(doctor_group)


    test_user.is_staff = True
    test_user.save()


    test_user.refresh_from_db()  # Refresh from DB to get latest changes
    assert doctor_group in test_user.groups.all()



    #login them to GET the ACCESS TOKEN
    #login with cred
    token_url = reverse('login')
    token_response = client.post(token_url, data = {
        "user_id": "testuser",
        "password": "secret"
    }, content_type='application/json')

    assert token_response.status_code == 200



    #now access the target url with credentials
    #reponse.get[access] 
    token = token_response.json().get("access")
    assert token is not None
    
    #access endpoint
    payload = {
        "name": "John Doe",
        "date_of_birth": "1990-05-15",
        "address": "123 Main Street, Springfield",
        "admission_date": "2023-10-01",
        "discharge_date": "2023-10-01",
        "status": "Admitted",
        "current_condition": "Stable, recovering from surgery",
        "phone": "+1234567890",
        "email": "johndoe@example.com",
        "emergency_contact_name": "Jane Doe",
        "emergency_contact_phone": "+0987654321",
        "is_active": "Active"
    }

    target_url = reverse('patient_create')
    response = client.post(target_url, HTTP_AUTHORIZATION=f'Bearer {token}', data=payload)
    

    assert response.status_code == 201 

    data = response.json()
    assert data.get("name") == "John Doe"

    #client.post(target url, data{})

    

