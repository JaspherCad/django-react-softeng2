// Frontend configuration
const config = {
  // API Configuration
  API_HOST: import.meta.env.VITE_API_HOST || '172.30.6.177',
  API_PORT: import.meta.env.VITE_API_PORT || '8000',
  CLIENT_PORT: import.meta.env.VITE_CLIENT_PORT || '3000',
  
  // Computed URLs
  get API_BASE_URL() {
    return `http://${this.API_HOST}:${this.API_PORT}`;
  },
  
  get CLIENT_BASE_URL() {
    return `http://${this.API_HOST}:${this.CLIENT_PORT}`;
  },
  
  get API_URL() {
    return `${this.API_BASE_URL}/api`;
  },
  
  // Helper functions
  getMediaURL: (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${config.API_BASE_URL}${path}`;
  },
  
  getApiEndpoint: (endpoint) => {
    return `${config.API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
};

export default config;
