import { createContext, useEffect, useState } from "react";
import axiosInstance, { checkAuthApi, loginApi } from "../api/axios";

const USE_HTTP_ONLY = false; // Match the setting in axios.js

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);


  //TODO: setup initial check if user is logged in. 
  // ONLY CALL THE API with these conditions
    //WHEN
      // Load the app
          //meaning no database hit on all access except these three
      // Login
      
      // Refresh the page

  const checkAuth = async () => {
    try {
      const response = await checkAuthApi();
      console.log(response.data)
      setUser(response.data);
      console.log("Check auth response:", response.data);
    } catch (error) {
      // Handle 401 errors specifically
      console.log("Check auth response:", error.response);

      if (error.response?.status === 401) {
        setUser(null);
        if (!USE_HTTP_ONLY) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
    } finally {
      setAuthChecked(true);
    }
  };
  

  //call check auth at Initial app laoding, every refresh, and upon logging in

  useEffect(() => {
    const validateAuth = async () => {
      if (USE_HTTP_ONLY || localStorage.getItem('refreshToken')) {
        await checkAuth();
      } else {
        // Immediate cleanup if no potential credentials
        if (!USE_HTTP_ONLY) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
        setAuthChecked(true);
      }
    };
    validateAuth();
  }, []);

 








  const login = async (userId, password, role) => {
    try {
      console.log("Login attempt with:", userId, password, role);
      const response = await loginApi(userId, password);
      console.log("Login response:", response.data.access);
      // const userData = response.data.user;

      if (!USE_HTTP_ONLY) {
        // Only store in localStorage if not using HTTP-only cookies
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      }

      // setUser({
      //   name: response.data.access,
      //   role: role,
      //   // ... other user data
      // });

      // Get fresh user data after login
      await checkAuth();

      return true;

    } catch (error) {
      console.error('Login failed:', error);
          
      if (error.response) {
        throw error; //send the error to RECIEVER (e.g index)
      } else if (error.request) {
        // The request was made but no response was received
        throw error

      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }

      return false;
    }
  };

  const logout = async () => {
    try {
      // await axiosInstance.post('/auth/logout'); SINCE FOR NOW WE ONLY USE LOCALSTORAGE< FORGET THIS FOR NOW
        //THIS IS ONLY FOR ""HTTPONLY""
      
      if (!USE_HTTP_ONLY) {
        console.log('removed tokens')
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
}; 
