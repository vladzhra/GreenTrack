import React, { createContext, useState } from 'react';

export const BinsContext = createContext();

export const BinsProvider = ({ children }) => {
  const [bins, setBins] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    stationAdress: "Carrer de Joan Miró, 21, 08005 Barcelona",
    startingPoint: "41.390832,2.193923",
  });

  return (
    <BinsContext.Provider value={{ bins, setBins, profile, setProfile }}>
      {children}
    </BinsContext.Provider>
  );
};