"use client"
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppWrapper ({children}){
    const [userServices, setServices] = useState([]);
    const [numberPlaces, setNumberPlaces] = useState(1);
    const [userResponses, setResponses] = useState(null);
    const [apiServices, setAPIServices] = useState(null);

    const contextValues = { //for better practice
        userServices,
        setServices,
        numberPlaces,
        setNumberPlaces,
        userResponses, 
        setResponses,
        apiServices, 
        setAPIServices
    }

    return(
        <AppContext.Provider value = {contextValues}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext);
}