import React, { createContext, useState } from 'react';

export const BinsContext = createContext();

export const BinsProvider = ({ children }) => {
  const [bins, setBins] = useState([]);

  return (
    <BinsContext.Provider value={{ bins, setBins }}>
      {children}
    </BinsContext.Provider>
  );
};
