# # tests.py in your DRF app

# from rest_framework.test import APITestCase, APIClient
# from django.urls import reverse
# from rest_framework import status
# from ..models import User
# from django.contrib.auth.models import Group



# #OPEN API (not logged in TEST)
# class MyAPITest(APITestCase):
#     def test_get_endpoint(self):
#         #path('about', views.about, name='aboutss'),
#         #shiii. use the name='' instead
#         url = reverse('aboutss') 
#         response = self.client.get(url)
#                         #INPUT                  #expected_output
#         self.assertEqual(response.status_code, status.HTTP_200_OK)



# class AuthenticatedAPITest(APITestCase):
#     def setUp(self):
#         # Create user
#         self.user = User.objects.create_user(user_id='testuser', password='testpass', role='Admin', department='IT')
        
#         # Assign the user to the 'Admin' group
#         admin_group, _ = Group.objects.get_or_create(name='Admin')
#         self.user.groups.add(admin_group)
        
#         # Login and get the JWT token
#         self.client = APIClient()
#         login_url = reverse('login')
#         data = {"user_id": "testuser", "password": "testpass"}
#         response = self.client.post(login_url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.access_token = response.data['access']
#         print(self.access_token)
#         print([group.name for group in self.user.groups.all()])


#     def test_authenticated_access(self):
#         url = reverse('test-protected-view')
        
#         # Set the authorization header
#         self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        
#         # Access authenticated API
#         response = self.client.get(url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)