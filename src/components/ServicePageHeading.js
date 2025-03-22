"use client"
import Account_Overlay from "./Account_Overlay"
import "../app/css/service_card.css"
import { useState } from "react"
import { useAppContext } from "@/context"

export default function ServicePageHeading(){
    const [isVisible, setIsVisible] = useState(false);
    const {userEmail} = useAppContext();
    const toggleOverlay = () => {
      setIsVisible(!isVisible);
    };

    return (
        <div>
            {userEmail != null ? 
            <div className = "row row-cols-3 h-25 border_design pb-2">
                <div className = "col-3 ps-5 pt-2"> <img  width = "15%" src ="https://www.nicepng.com/png/full/17-178841_home-png-home-icon-free.png" alt = "home icon"/></div> 
                <div className="col-6 text-center pt-2"><h1 className="fs-1 fw-bolder text-white">Services Menu</h1></div>
                
                <div className="col-3 pe-5 pt-2 d-flex justify-content-end">
                    <img onClick={toggleOverlay} width="15%" src = "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Picture.png" className = "position-relative" alt = "profileIcon" /> 
                    {isVisible && <Account_Overlay />}
                </div>
            </div>
            :
            <div className="text-center pt-2 border_design">
                <h1 className="fs-1 fw-bolder text-white">Services Menu</h1>
            </div>
            }


        </div>
    )
}