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
            <div className = "pb-2">

                <div className = "col-3 ps-5 pt-2" onClick={resetUserServices} ><Link href={"/home"}><img  width = "15%" src ="https://www.nicepng.com/png/full/17-178841_home-png-home-icon-free.png" alt = "home icon"/></Link></div> 

                <div className="col-6 text-center pt-2"><h1 className="fs-1 fw-bolder text-white">Services Menu</h1></div>
                
                <div className="col-3 pe-5 pt-2 d-flex justify-content-end">
                    <img onClick={toggleOverlay} width="15%" src = "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Picture.png" className = "position-relative" alt = "profileIcon" /> 
                    {isVisible && <Account_Overlay />}
                </div>
            </div>
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