"use client"
import Account_Overlay from "./Account_Overlay"
import "../app/css/service_card.css"
import { useState } from "react"
import { useAppContext } from "@/context"
import Link from "next/link";

export default function ServicePageHeading(){
    const [isVisible, setIsVisible] = useState(false);
    const {userEmail, setServices} = useAppContext();
    const toggleOverlay = () => {
      setIsVisible(!isVisible);
    };

    const resetUserServices = () => {
        setServices([]);
    }

    return (
        <div className="rounded-t-lg bg-slate-900">
            {userEmail != null ? 
            <>
                <div className = "pb-2 grid grid-cols-3">
                    <div className = "pl-5 pt-2" onClick={resetUserServices} ><Link href={"/home"}><img className="ml-10" width = "15%" src ="https://www.nicepng.com/png/full/17-178841_home-png-home-icon-free.png" alt = "home icon"/></Link></div> 

                    <div className="text-center pt-5 pb-8">
                        <h1 className="text-4xl font-extrabold text-white">Services Menu</h1>
                    </div>

                
                    
                    <div className="pt-2 flex justify-end">
                        <img onClick={toggleOverlay} width="15%" src = "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Picture.png" className = "relative mr-20" alt = "profileIcon" /> 
                        {isVisible && <Account_Overlay />}
                    </div>
                </div>
                <div className="h-2 bg-gray-500"/>
            </>

            
            :
            <>
                <div className="text-center pt-5 pb-8">
                    <h1 className="text-4xl font-extrabold text-white">Services Menu</h1>
                </div>
                <div className="h-2 bg-gray-500"/>
            </>

            }


        </div>
    )
}