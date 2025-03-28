import React, { createContext, useState } from 'react';

export const BinsContext = createContext();

export const BinsProvider = ({ children }) => {
  const [bins, setBins] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    stationAdress: "Carrer de Joan Miró, 21, Sant Martí, 08005 Barcelona",
    startingPoint: "",
  });

  return (
    <BinsContext.Provider value={{ bins, setBins, profile, setProfile }}>
      {children}
    </BinsContext.Provider>
  );
};