"""
Configuration utility for Django backend
Reads configuration from shared.env or environment variables
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Path to shared configuration file
SHARED_ENV_PATH = BASE_DIR / 'shared.env'

def load_shared_config():
    """Load configuration from shared.env file"""
    config = {}
    
    if SHARED_ENV_PATH.exists():
        with open(SHARED_ENV_PATH, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    config[key.strip()] = value.strip()
    
    return config

# Load shared configuration
SHARED_CONFIG = load_shared_config()

# Configuration with fallbacks
# API_HOST = os.getenv('API_HOST', SHARED_CONFIG.get('API_HOST', '172.30.8.147'))
API_HOST = os.getenv('API_HOST', SHARED_CONFIG.get('API_HOST', '172.30.6.177'))

API_PORT = int(os.getenv('API_PORT', SHARED_CONFIG.get('API_PORT', '8000')))
CLIENT_PORT = int(os.getenv('CLIENT_PORT', SHARED_CONFIG.get('CLIENT_PORT', '3000')))

# Computed URLs
CLIENT_URL = f"http://{API_HOST}:{CLIENT_PORT}"
API_BASE_URL = f"http://{API_HOST}:{API_PORT}"

# CORS allowed origins
CORS_ALLOWED_ORIGINS = [
    CLIENT_URL,
    f"http://localhost:{CLIENT_PORT}",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

# CSRF trusted origins  
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()

# Allowed hosts
ALLOWED_HOSTS = ['*', API_HOST, 'localhost', '127.0.0.1']

# Export configuration
__all__ = [
    'API_HOST',
    'API_PORT', 
    'CLIENT_PORT',
    'CLIENT_URL',
    'API_BASE_URL',
    'CORS_ALLOWED_ORIGINS',
    'CSRF_TRUSTED_ORIGINS',
    'ALLOWED_HOSTS'
]
