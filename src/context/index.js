"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

//! wraps the the children into a bundle and makes it shareable and its values elswhere
export function AppWrapper({ children }) {
  const [userServices, setServices] = useState(null);
  const [userResponses, setResponses] = useState(null);
  const [apiServices, setAPIServices] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const contextValues = {
    //for better practice
    userServices,
    setServices,
    userResponses,
    setResponses,
    apiServices,
    setAPIServices,
    userEmail,
    setUserEmail,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
}

//! when a component calls useAppContext,
export function useAppContext() {
  return useContext(AppContext);
}
