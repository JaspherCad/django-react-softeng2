import React, { useEffect, useState } from 'react';
import { testApi } from '../api/axios';

const Dashboard = () => {
  const [testMessage, setTestMessage] = useState('');
  const [error, setError] = useState(null);

  
  return (
    <div className="dashboardContainer">
      <h2>Dashboard</h2>
      
    </div>
  );
};

export default Dashboard;