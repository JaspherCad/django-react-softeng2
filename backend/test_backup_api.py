import requests
import json

# Test the backup API endpoint
url = "http://172.30.6.177:8000/api/backup/"

# You'll need to get an actual JWT token from your frontend or login
# For now, let's just test if the endpoint responds without auth error
try:
    response = requests.post(url, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
