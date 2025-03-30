"use client"
import RouteButton from "@/components/route_button";
import Image from "next/image";
import { useEffect, useState } from "react";


function WelcomePage(){
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
    setTimeout(() => {
        setIsVisible(true);
    }, 50); 
    }, []);
    return (
        <div className="h-300 bg-slate-900/55">
            <div className = "relative">
                <div className = "absolute top-0 right-0 mt-6 mr-4 w-50 z-10">
                    <RouteButton name = "Login" location = "/login"/>
                </div>
            </div>
            <div className="flex justify-center items-center relative">
                <Image className={`transition-opacity duration-500 ease-in ${isVisible ? "opacity-25 ": "opacity-0"}`} src= "/imgs/better_world_logo.png" alt = "globe" width = {500} height={500}/>
                    <div className="absolute w-full">
                        <div className="relative"> 
                            <h1 className="text-8xl text-center font-bold pt-10">Welcome To PLANIT!</h1>
                            <div className="absolute text-2xl/10 mt-3 w-full">
                            <p className="text-left ml-3">A service based application that helps you plan the perfect trip by:</p>
                                    <ul className="list-inside list-disc ml-7">
                                        <li>Give users best service match based on responses, whether through questionnaire or through name searching</li>
                                        <li>Shows nearby services on every selected service</li>
                                        <li>Giving real time information about services such as:</li>
                                        <ul className="list-inside list-disc ml-15">
                                            <li>User Ratings</li>
                                            <li>Weekkly Hourly Operations</li>
                                            <li>Service Gallery</li>
                                            <li>Service's Websites</li>
                                            <li>Fuel Prices</li>
                                            <li>Price Range (Food Only)</li>
                                        </ul>
                                        <li>Stores user's previous created list of services for future references</li>
                                        <li>Keeps track of user's favorites services</li>
                                        <li>Alerts users of any traffic complications based on service address</li>
                                    </ul> 
                                    <div className="mt-20 ml-0 flex justify-center w-full text-3xl font-semibold">
                                        Ready to make an account?
                                    </div>
                                    <div className="w-full flex justify-center mt-7" >
                                        <div className="w-2/3 z-10">
                                            <RouteButton name = "Sign Up" location = "/signup" />
                                        </div>
                                    </div>
                            </div>
                            <div className="absolute top-0 bg-slate-800 w-full h-250 opacity-10"></div>

                        </div>
                        </div>

            </div>



        </div>
    )
}

export default WelcomePage;
