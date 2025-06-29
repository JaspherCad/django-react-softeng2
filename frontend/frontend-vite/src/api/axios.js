import axios from 'axios';
import config from '../config/config';

// You can toggle this based on your backend configuration
const USE_HTTP_ONLY = false; // Set to false if using localStorage JWT

const axiosInstance = axios.create({
  baseURL: config.API_URL,
  withCredentials: true, // Always true for both approaches to handle cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});




//NOTE FOR ME:
//LOCALSTORAGE:
//if we are rfreshing using the localstorage we do this
//1. get the refresh token from localstorage
//2. send the refresh token to the server
//3. server returns a new access token
//4. we save the new access token to localstorage
//5. we send the new access token to the server
// DO U REALIZE THAT WE DONT NEED HEADERS???

// Add these constants
const AUTH_ENDPOINTS = ['/user/login', '/token/refresh'];
const REFRESH_COOKIE_NAME = 'refresh_token';


// allows us to modify or inspect a request before it is sent to the backend

axiosInstance.interceptors.request.use(config => {
  // Skip auth header for auth endpoints and cookie-based auth
  if (AUTH_ENDPOINTS.some(path => config.url.includes(path)) || USE_HTTP_ONLY) {
    return config;
  }

  //other endpoints REQUIRES BEARER TOKEN

  const token = localStorage.getItem('token');
  console.log("HEADER HAS BEEN SET: " + token)
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});




// allows us to modify or inspect a request before it is sent to the backend
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Skip handling for auth endpoints and non-401 errors (500,300,400,etc)
    if (AUTH_ENDPOINTS.some(path => originalRequest.url.includes(path)) ||

      originalRequest._retryCount >= 2) {
      if (error.code === "ERR_NETWORK") {
        alert("ERR_NETWORK: PLEASE CHECK CONNETION")
      }
      console.log("ERROR IS NOT 401, so skipping handling expired tokens")
      return Promise.reject(error);
      //AFAIK this throws other errors to catch statements 
    }

    const statusCode = error.response?.status;


    switch (statusCode) {
      case 401:
        //if error 401: NO TOKEN or EXPIRED TOKEN. do this

        //The retry logic is triggered only when a request receives a 401 Unauthorized error,
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

        // Check for valid refresh credentials
        const hasRefresh = USE_HTTP_ONLY ?
          document.cookie.includes(REFRESH_COOKIE_NAME) :
          localStorage.getItem('refreshToken');

        if (!hasRefresh) {
          // this.handleAuthFailure();  //axiosInstance.interceptors.response.use is '.this'
          axiosInstance.handleAuthFailure() //redirects to login (walang tokens ee)
          return Promise.reject(error);
          //stop here
        }



        //USE THE REFRESH TOKEN TO GET ACCESS TOKEN AGAIN
        //if localstorage
        //get the access token on localStorage then use it 
        //if refreshtoken is expired, remove all tokens(access/refresh) then redirect to login

        alert("BRO! TOKEN IS EXPIRED... refreshing token")
        try {
          if (USE_HTTP_ONLY) {
            await axiosInstance.post('/token/refresh');
          }
          else { //LOCAL STORAGE
            const { data } = await axiosInstance.post('/token/refresh', {
              refresh: localStorage.getItem('refreshToken')
            });
            localStorage.setItem('token', data.access);
          }
          return axiosInstance(originalRequest); //retry original request
        } catch (refreshError) {
          alert("REFRESH TOKEN EXPIRED. RELOGIN AGAIN...")
          // this.handleAuthFailure();  //axiosInstance.interceptors.response.use is '.this'
          axiosInstance.handleAuthFailure()
          return Promise.reject(refreshError);
        }

      case 403: // Forbidden
        console.error("Error 403: You do not have permission.");
        alert("You are not authorized to access this resource.");
        return Promise.reject(error);

      case 500: // Internal Server Error
        console.error("Error 500: Server-side issue.");
        alert("The server encountered an error. Please try again later.");
        return Promise.reject(error);

      case 404: // Not Found
        console.error("Error 404: Resource not found.");
        alert("The requested resource could not be found.");
        return Promise.reject(error);

      default:
        console.error(`Unhandled error status: ${statusCode}`);
        alert(`An error occurred: ${statusCode}`);
        return Promise.reject(error);
    }


  }
);

// Add auth handling methods
axiosInstance.handleAuthFailure = () => {
  console.log("Handling auth failure..."); // Add this line

  if (!USE_HTTP_ONLY) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
  console.log("Redirecting to /login..."); // Add this line

  window.location.href = '/login';
};

axiosInstance.handleLoginRedirect = () => {
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};
















// // Response interceptor
// axiosInstance.interceptors.response.use(
//   //if no error, return response
//   (response) => {
//     return response;
//   },

//   //if error, return error
//   async (error) => {
//     const originalRequest = error.config;


//     //error 401: NO TOKEN or EXPIRED TOKEN.
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         if (USE_HTTP_ONLY) {
//           // For HTTP-only cookies, just hit the refresh endpoint
//           // The cookie will be automatically sent
//           const response = await axiosInstance.post('/token/refresh');
//           return axiosInstance(originalRequest);
//         } else {
//           // For localStorage JWT
//           const refreshToken = localStorage.getItem('refreshToken');
//           const response = await axiosInstance.post('/token/refresh', { 
//             refresh: refreshToken 
//           }); //returns new access token

//           if (response.data.access) { //JWT is access token
//             localStorage.setItem('token', response.data.access);
//             originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
//             return axiosInstance(originalRequest);
//           }
//         }
//       } catch (error) {
//         if (!USE_HTTP_ONLY) {
//           // Clear localStorage tokens
//           localStorage.removeItem('token');
//           localStorage.removeItem('refreshToken');
//         }
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// API calls
export const testApi = async () => {
  try {
    const response = await axiosInstance.get('/protected');
    return response;
  } catch (error) {
    throw error;
  }
};



export const listOfPatientAPI = async (page = 1) => {
  try {
    const response = await axiosInstance.get(`/patients/list?page=${page}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const archivedPatients = async (page = 1) => {
  try {
    const response = await axiosInstance.get('/patients/archived/', {
      params: { page }
    });
    return response;   
  } catch (error) {
    throw error;
  }
};

export const unarchivePatient = async (patientId) => {
  try {
    const response = await axiosInstance.post(`/patients/archived/`, {
      id: patientId,
      unarchive: true
    });
    return response;
  } catch (error) {
    throw error;
  }
};



export const addBillingsApi = async (patientData) => {
  try {
    const response = await axiosInstance.post('/billings/add',
      patientData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const addBillingItemApi = async (billingData, billingId) => {
  try {
    const response = await axiosInstance.post(`/billings/add-billing-item/${billingId}`,
      billingData);
    //       {
    //     "service": 1,
    //     "quantity": 1,
    //     "cost_at_time": 2000
    // }

    return response;
  } catch (error) {
    throw error;
  }
};


export const dischargePatientAPI = async (patientId) => {
  try {
    const response = await axiosInstance.post(`/discharge-patient/${patientId}`);
    // {
    //     "service": 1,
    //     "quantity": 1,
    //     "cost_at_time": 2000
    // }

    return response;
  } catch (error) {
    throw error;
  }
};



//.post(`/api/patients/${patientId}/archive/`, { archive: true });
export const archiveOrUnarchivePatient = async (patientId, archive = true) => {
  try {
    const response = await axiosInstance.post(`/patients/${patientId}/archive/`, { archive });
    return response;
  } catch (error) {
    throw error;
  }
};





export const editBillingItemApi = async (billingCode, billingItemId, billingData) => {
  try {
    const response = await axiosInstance.put(`/billings/${billingCode}/items/${billingItemId}/edit`,
      billingData);
    console.log(billingData)
    //       {
    //     "service": 1,
    //     "quantity": 1,
    //     "cost_at_time": 2000
    // }

    return response;
  } catch (error) {
    throw error;
  }
};


export const SearchBillingsApi = async (searchTerm) => {
  try {
    const response = await axiosInstance.get('/billings/search', {
      params: { q: searchTerm }
    }

    );
    return response;
  } catch (error) {
    throw error;
  }
};


export const SearchBillingsApiAdmittedOnly = async (searchTerm) => {
  try {
    const response = await axiosInstance.get('/billings_exclud_discharged/search', {
      params: { q: searchTerm }
    }

    );
    return response;
  } catch (error) {
    throw error;
  }
};

//billings_exclud_discharged/search
export const SearchBillingsApiExcludingDischarged = async (searchTerm) => {
  try {
    const response = await axiosInstance.get('/billings_exclud_discharged/search', {
      params: { q: searchTerm }
    }

    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const SearchHospitalUserApi = async (searchTerm) => {
  try {
    const response = await axiosInstance.get('/users/search', {
      params: { q: searchTerm }
    }

    );
    return response;
  } catch (error) {
    throw error;
  }
};




export const SearchPatientsApi = async (searchTerm) => {
  try {
    const response = await axiosInstance.get('/patients/search', {
      params: { q: searchTerm }
    }

    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const SearchLaboratoryApi = async (searchTerm) => {
  try {
    const response = await axiosInstance.get('/laboratory/search-laboratory', {
      params: { q: searchTerm }
    }

    );
    return response;
  } catch (error) {
    throw error;
  }
};


export const SearchServicesApi = async (searchTerm) => {
  try {
    const response = await axiosInstance.get('/service/search', {
      params: { q: searchTerm }
    }

    );
    return response;
  } catch (error) {
    throw error;
  }
};

//uploadPatientImageAPI

export const getPatientImagesAPI = async (patientId) => {
  try {
    const response = await axiosInstance.get(`patient-images/${patientId}`);
    return response
  } catch (error) {
    console.error("Failed to fetch patient images:", error);
  }
};




export const getPatientReportAPI = async (startDate, endDate, page = 1, pageSize = 10) => {
  try {
    // we pass dates as query params
    const response = await axiosInstance.get(`patients/report/`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        page,
        page_size: pageSize
      }
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch patient report:", error);
    throw error;
  }
};




export const listOfBillingsAPI = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get('billings/list/v2', {
      params: { page, pageSize }
    });


    return response
  } catch (error) {
    throw error;
  }
};


export const getBillingItemByIdAPI = async (billingId) => {
  try {
    const response = await axiosInstance.get(`/billing_item/id/${billingId}`);
    return response;
  } catch (error) {
    throw error;
  }
};



export const getBillingByID = async (id) => {
  try {
    const response = await axiosInstance.get(`/billings/id/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (user_id_obj) => {
  try {
    const response = await axiosInstance.post(`/forgot-password`, user_id_obj);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBillingByACTUALIDandNotCODE = async (id) => {
  try {
    const response = await axiosInstance.get(`/billings/actualid/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

//simple return true or false lang. NVM
function isObjectWithFields(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length > 0;
}

export const addPatientAPI = async (newPatientData) => {
  try {
    const response = await axiosInstance.post('/patients/create',
      newPatientData
    );
    return response;
  } catch (error) {
    const errorData = error.response?.data || {};
    // Normalize field validation errors
    if (isObjectWithFields(errorData)) {
      error.validationErrors = errorData;
      console.error("TRUE");
      console.error(error.validationErrors)
      //       { SAMPLE ERROR.validationErrors
      //     "case_number": [
      //         "patient with this case number already exists."
      //     ],
      //     "date_of_birth": [
      //         "Date has wrong format. Use one of these formats instead: YYYY-MM-DD."
      //     ]
      // }

    } else if (errorData.error) {
      console.error("FALSE");

    }

    throw error;
  }
};



export const patientDetailsAPI = async (patientId) => {
  try {
    const response = await axiosInstance.get(`/patients/${patientId}`)
    return response
  } catch (error) {
    throw error;
  }
}

export const editPatientAPI = async (patientId, updatedPatientData) => {
  try {
    console.log(`/patients/update/${patientId}`)
    const response = await axiosInstance.put(`/patients/update/${patientId}`, {
      ...updatedPatientData
    });
    return response;
  } catch (error) {
    const errorData = error.response?.data || {};
    // Normalize field validation errors
    if (isObjectWithFields(errorData)) {
      error.validationErrors = errorData;
      console.error("TRUE");
      console.error(error.validationErrors)
      //       { SAMPLE ERROR.validationErrors
      //     "case_number": [
      //         "patient with this case number already exists."
      //     ],
      //     "date_of_birth": [
      //         "Date has wrong format. Use one of these formats instead: YYYY-MM-DD."
      //     ]
      // }

    } else if (errorData.error) {
      console.error("FALSE");

    }

    throw error;
  }
};


export const editPatientINCLUDINGCASENUMBERAPI = async (patientId, updatedPatientData) => {
  try {
    console.log(`/patients/update/${patientId}`)
    const response = await axiosInstance.put(`/patients/update_new_casecode/${patientId}`, {
      ...updatedPatientData
    });
    return response;
  } catch (error) {
    const errorData = error.response?.data || {};
    // Normalize field validation errors
    if (isObjectWithFields(errorData)) {
      error.validationErrors = errorData;
      console.error("TRUE");
      console.error(error.validationErrors)
      //       { SAMPLE ERROR.validationErrors
      //     "case_number": [
      //         "patient with this case number already exists."
      //     ],
      //     "date_of_birth": [
      //         "Date has wrong format. Use one of these formats instead: YYYY-MM-DD."
      //     ]
      // }

    } else if (errorData.error) {
      console.error("FALSE");

    }

    throw error;
  }
};

export const loginApi = async (user_id, password) => {
  try {
    const response = await axiosInstance.post('/user/login', {
      user_id,
      password
    });
    return response;
  } catch (error) {
    throw error;
  }
};


export const checkAuthApi = async () => {
  try {
    const response = await axiosInstance.get('/auth/check');
    return response;
  } catch (error) {
    throw error;
  }
};


export const addLabRecordsToPatient = async (patientId, labData) => {
  try {
    const response = await axiosInstance.post(`/laboratory/add-patient-laboratory/patient-id/${patientId}`,
      labData
    );
    return response;
  } catch (error) {
    throw error;
  }
};






export const createClinicalNoteAPI = async (patientId, case_number, newNoteData) => {
  try {
    const response = await axiosInstance.post(`/patients/${patientId}/notes/${case_number}/create`,
      newNoteData
    );
    return response;
  } catch (error) {
    throw error;
  }
};




export const addLabFilesToLaboratory = async (labId, labFiles) => {
  try {
    const response = await axiosInstance.post(`/laboratory/files/group/${labId}`,
      labFiles,
      {
        headers: {

          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};





export const uploadPatientImageAPI = async (labFiles) => {
  try {
    const response = await axiosInstance.post(`/patient-image-upload`,
      labFiles,
      {
        headers: {

          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};



export const uploadUSERSADMINImageAPI = async (userId, formData) => {
  try {
    console.log('Uploading to URL:', `/user/${userId}/upload-image/`);
    console.log('User ID type:', typeof userId, 'Value:', userId);
    
    const response = await axiosInstance.post(`/user/${userId}/upload-image/`, 
      formData
      // Don't set Content-Type manually - let FormData handle it with boundary
    );
    return response;
  } catch (error) {
    console.error('Upload API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error;
  }
};



export const assignBed = async (patientID, bedID, billingID) => {
  //                PatientID   /  bedID   /   billingID

  try {
    const response = await axiosInstance.post(`/assign-bed/${patientID}/${bedID}/${billingID}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchServerTime = async () => {
  try {
    const res = await client.get('/server-time')  // you need a simple view returning {"server_time": "..."}
    return res.data
  } catch (error) {
    throw error;
  }

}


export const fetchLab = async (labId) => {
  try {
    const response = await axiosInstance.get(`/laboratory/get-laboratory/${labId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



//http://:8000/api/notes/history/4678NEW
export const fetchClinicalNotesByCodeAPI = async (code) => {
  try {
    const response = await axiosInstance.get(`/notes/history/${code}`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const fetchPatientHistoryByIdAPI = async (patientId, historyId) => {
  try {
    const response = await axiosInstance.get(`/patients/${patientId}/history/id/${historyId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const FetchUsersAPI = async () => {
  try {
    const response = await axiosInstance.get(`/users/list`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const FetchUsersRolesAPI = async () => {
  try {
    const response = await axiosInstance.get(`/users/roles`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const fetchPatientHistoryAPI = async (labId) => {
  try {
    const response = await axiosInstance.get(`/patients/${labId}/history`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchBedAssignments = async (activeOnlyBoolean) => {
  try {
    const response = await axiosInstance.get(`/bed-assignments/?active=${activeOnlyBoolean}`)
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchRooms = async () => {
  try {
    const response = await axiosInstance.get(`/room_bed_list`);
    return response;
  } catch (error) {
    throw error;
  }
};




export const currentUserLogs = async () => {
  try {
    const response = await axiosInstance.get('/userlogs');
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user logs with date filtering and pagination
export const getUserLogsAPI = async (startDate, endDate, page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get('/userlogs/', {
      params: {
        start_date: startDate,
        end_date: endDate,
        page: page,
        page_size: pageSize
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user logs by specific user ID
export const getUserLogsByIdAPI = async (userId, startDate, endDate, page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get(`/userlogs/${userId}/`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        page: page,
        page_size: pageSize
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all user logs (admin access)
export const getAllUserLogsAPI = async (startDate, endDate, page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get('/userlogs/all', {
      params: {
        start_date: startDate,
        end_date: endDate,
        page: page,
        page_size: pageSize
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBillingsByPatientAPI = async (patientId) => {
  try {
    const response = await axiosInstance.get(`/billings/patient/${patientId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;