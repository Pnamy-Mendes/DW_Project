// CreatedItems.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ConfigContext from './../contexts/ConfigContext';

const CreatedItems = () => {
  const [createdItemsCount, setCreatedItemsCount] = useState(0);
  const { getApiUrl } = useContext(ConfigContext);
  const apiUrl = getApiUrl();

  useEffect(() => {
    const fetchCreatedItemsCount = async () => {
      try {
        const response = await axios.get(`${apiUrl}:3001/api/products`);
        const lengthCount = response.data.length;
        console.log(lengthCount);
        setCreatedItemsCount(lengthCount);
      } catch (error) {
        console.error('Error fetching created items count:', error);
        // Handle errors appropriately
      }
    };

    fetchCreatedItemsCount();
  }, [apiUrl]);

  return (
    <div id= 'css6'>
      <h3 id= 'css7'>Number of Products</h3>
      <p id= 'css8'>{createdItemsCount}</p>
    </div>
  );
  
};

export default CreatedItems;
