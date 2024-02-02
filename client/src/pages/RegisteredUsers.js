import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ConfigContext from './../contexts/ConfigContext';

const RegisteredUsers = () => {
  const [userCount, setUserCount] = useState(0);
  const { getApiUrl } = useContext(ConfigContext);
  const apiUrl = getApiUrl();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${apiUrl}:3001/api/users`); // Use the correct endpoint
        const lengthCount = response.data.length;
        console.log(lengthCount);
        setUserCount(lengthCount);
      } catch (error) {
        console.error('Error fetching user count:', error);
        // Handle errors appropriately
      }
    };

    fetchUserCount();
  }, [apiUrl]);

  return (
    <div className="bg-gray-50 p-12 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
      <p className="text-3xl font-bold text-purple-500">{userCount}</p>
    </div>
  );
};

export default RegisteredUsers;
