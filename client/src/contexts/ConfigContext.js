// src/contexts/ConfigContext.js
import React from 'react';

const ConfigContext = React.createContext({});

export const ConfigProvider = ConfigContext.Provider;
export { ConfigContext }; // Add this line to export ConfigContext
export default ConfigContext;
