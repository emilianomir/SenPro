"use client"
import Account_Overlay from "./Account_Overlay"
import { useState } from "react"
import { useAppContext } from "@/context"
import { redirect, useRouter } from "next/navigation"

export default function ServicePageHeading({heading}){
    const [isVisible, setIsVisible] = useState(false);
    const {userEmail} = useAppContext();
    const router = useRouter();
    const toggleOverlay = () => {
      setIsVisible(!isVisible);
    };


    return (
        <div className="bg-page-heading">
            {userEmail != null ? 
            <>
                <div className = "pb-2 grid grid-cols-8 md:grid-cols-3">
                    <div className = "col-span-2 md:col-span-1 flex items-center justify-center md:justify-start md:pl-5 md:pt-2 w-full" >
                        <div className="w-1/2 md:w-2/5 lg:w-3/20">
                            <div className="cursor-pointer" onClick={()=> {
                                redirect("/home");
                            }}>
                            <img className="md:ml-10 w-auto" src ="/imgs/home-head.png" alt = "home icon" />
                            </div>
                        </div>
                    </div> 

                    <div className="col-span-4 md:col-span-1 flex justify-center py-3 text-center md:pt-5 md:pb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white">{heading ? heading : "Services Menu"}</h1>
                    </div>

                
                    {userEmail[0] != 'guest' ?
                    <div className="col-span-2 md:col-span-1 pt-2 flex items-center justify-center md:justify-end">
                        <img className = "md:relative md:mr-20 w-1/2 md:w-2/5 lg:w-3/20 cursor-pointer" onClick={toggleOverlay}  src = "/imgs/avatar-head.png"  alt = "profileIcon" /> 
                        {isVisible && <Account_Overlay />}
                    </div>
                    :
                    <></>
                    }
                    
                </div>             
                <div className="h-2 bg-heading-border"/>
            </>

            
            :
            <>
                <div className="text-center pt-5 pb-8">
                    <h1 className={`${userEmail ? "text-xl": "text-4xl"} font-extrabold text-white`}>Services Menu</h1>
                </div>
                <div className="h-2 bg-heading-border"/>
            </>

            }


        </div>
    )
}