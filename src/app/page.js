"use client"
import Land_Square from "@/components/Land_Square";
import RouteButton from "@/components/route_button";
import Image from "next/image";
import { useEffect, useState } from "react";

const info = [
    {
    title: "Location Based",
    text: ["Give users best service match based on responses, whether through questionnaire or through name searching",
    "Shows nearby services on every selected service", ] },
    {
    title: "RealTime Service Results",
    text: ["Weekly Operations", "Service Gallery", "Fuel Prices", "Price Range (Food Only)", "Traffic Complications"]
    },
    {
    title: "Future Reference",
    text: ["Stores user's previous created list of services for future references",
    "Keeps track of user's favorites services"

    ]
    }
]



function WelcomePage(){
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
    setTimeout(() => {
        setIsVisible(true);
    }, 50); 
    }, []);
    return (
        <>
        <div className="min-h-screen h-[200vh] md:h-[105vh] bg-first-bg">
            <div className = "grid grid-cols-2">
                <div className="flex items-center space-x-2 pl-5 pt-5">
                    <div className="">
                        <Image className={`transition-opacity duration-500 ease-in ${isVisible ? "opacity-100 ": "opacity-0"}`} src= "/imgs/blue_world_logo.png"  alt = "globe" width = {50} height={50}/>
                    </div>
                    <span className="text-3xl font-bold text-content-text">PLANIT</span>
                </div>
                <div className = "flex justify-end pr-5 pt-5 w-full z-10">
                    <RouteButton name = "Login" location = "/login"/>
                </div>
            </div>
            <div className="flex justify-center relative mt-5 h-full bg-land-sec-bg">
                    <div className="absolute w-full">
                        <div className="relative md:top-15"> 
                            <h1 className="2xl:text-9xl lg:text-8xl sm:text-6xl text-5xl text-center font-bold pt-10 text-content-text">Welcome To PLANIT!</h1>
                            <div className="absolute text-lg sm:text-2xl/10 mt-3 w-full sm:pr-3 md:p-0 ">
                            <p className="text-center mb-5 text-xl text-content-text">An application that helps you plan the perfect impromptu trip by providing:</p>
                            <div className="w-full flex justify-center">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-9/10">
                                    {info.map((str, index) => 
                                        <Land_Square key = {index + 100} index={index} info = {str}/>)
                                    }
                                </div>
                            </div>
                                    <div className="mt-15 ml-0 flex justify-center w-full text-content-text text-2xl md:text-3xl font-semibold">
                                        Ready to make an account?
                                    </div>
                                    <div className="w-full flex justify-center mt-7 pb-3" >
                                        <div className="w-2/3 z-10">
                                            <RouteButton name = "Sign Up" location = "/signup" />
                                        </div>
                                    </div>
                            </div>

                        </div>
                        </div>

            </div>



        </div>

        </>
    )
}

export default WelcomePage;
