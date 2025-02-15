import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainApp from './MainApp';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div>
          <MainApp />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;