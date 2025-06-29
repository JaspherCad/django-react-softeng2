# Configuration Management

This project now uses a centralized configuration system to manage IP addresses and URLs.

## Quick Start

To change the IP address for the entire application:

1. Edit `shared.env` in the project root
2. Update the IP address: `API_HOST=YOUR_NEW_IP`
3. Restart both frontend and backend servers

## Configuration Files

### Shared Configuration
- `shared.env` - Main configuration file for both frontend and backend

### Frontend Configuration
- `frontend/frontend-vite/.env` - Vite environment variables
- `frontend/frontend-vite/src/config/config.js` - Frontend configuration utility

### Backend Configuration  
- `backend/backend/config.py` - Django configuration utility

## Environment Variables

### Required Variables
```bash
API_HOST=172.30.8.147      # Server IP address
API_PORT=8000              # Backend port
CLIENT_PORT=3000           # Frontend port
```

### Frontend (.env)
```bash
VITE_API_HOST=172.30.8.147
VITE_API_PORT=8000
VITE_CLIENT_PORT=3000
VITE_API_BASE_URL=http://172.30.8.147:8000
```

## Usage Examples

### Frontend (React)
```javascript
import config from '../config/config';

// API requests (automatically handled by axios)
axiosInstance.get('/users');

// Media URLs
<img src={config.getMediaURL(user.image)} />

// Direct API endpoints
const response = await axios.get(config.getApiEndpoint('/forgot-password'));
```

### Backend (Django)
```python
from backend.config import API_HOST, CLIENT_URL

# Configuration is automatically imported in settings.py
# CORS_ALLOWED_ORIGINS, ALLOWED_HOSTS, etc. are set automatically
```

## Migration Status

✅ **Completed:**
- `vite.config.js` - Uses environment variables
- `axios.js` - Uses config for base URL
- `UserDetail.jsx` - Uses config for image URLs
- `ForgotPassword` components - Use config for API endpoints
- Django `settings.py` - Uses config module
- Backend `config.py` - Centralized configuration

🔄 **Partially Updated:**
- Various `.jsx` components still have hardcoded URLs in:
  - Image displays
  - API endpoint logging/debugging
  - Alert messages with URLs

## Manual Updates Needed

Some files still need manual updates to use the config system:

1. **Image URLs** - Replace `http://172.30.8.147:8000${path}` with `config.getMediaURL(path)`
2. **Debug URLs** - Replace hardcoded URLs in console.log and alert statements
3. **Comment URLs** - Update example URLs in comments

## Benefits

1. **Single Point of Configuration** - Change IP in one place
2. **Environment Flexibility** - Easy development/production switching
3. **Type Safety** - Helper functions prevent URL construction errors
4. **Fallback Support** - Graceful handling of missing configuration

## Deployment

For different environments:

1. **Development**: Edit `shared.env`
2. **Production**: Set environment variables or update config files
3. **Docker**: Mount config files or use environment variables

## Troubleshooting

1. **Frontend not connecting**: Check `VITE_API_BASE_URL` in `.env`
2. **Backend CORS errors**: Verify `API_HOST` and `CLIENT_PORT` in `shared.env`
3. **Images not loading**: Ensure `config.getMediaURL()` is used for image sources
