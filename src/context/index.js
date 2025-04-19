"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppWrapper ({children}){
    const [userServices, setServices] = useState([]);
    const [numberPlaces, setNumberPlaces] = useState(0);
    const [userResponses, setResponses] = useState(null);
    const [apiServices, setAPIServices] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [guestAddress, setGuestAddress] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const contextValues = { //for better practice
        userServices,
        setServices,
        numberPlaces,
        setNumberPlaces,
        userResponses, 
        setResponses,
        apiServices, 
        setAPIServices,
        userEmail,
        setUserEmail,
        guestAddress,
        setGuestAddress,
        userAddress,
        setUserAddress,
        favorites,
        setFavorites,
    }

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
}

//! when a component calls useAppContext,
export function useAppContext() {
  return useContext(AppContext);
}
