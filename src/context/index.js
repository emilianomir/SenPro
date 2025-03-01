"use client"
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppWrapper ({children}){
    const [userServices, setServices] = useState(null);

    return(
        <AppContext.Provider value = {[userServices, setServices]}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext);
}