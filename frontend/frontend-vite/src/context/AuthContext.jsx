import { createContext, useState } from "react";

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Updated login to include role
  const login = (username, role) => {
    setUser({ 
      name: username,
      role: role // 'Admin', 'Doctor', 'Nurse', 'Staff', 'Teller'
    });
  };

  // Function to logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 
