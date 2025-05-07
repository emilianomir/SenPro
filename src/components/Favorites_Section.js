"use client"
import { useAppContext } from "@/context"
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getFavorites } from '@/components/DBactions';
import Favorites from "@/components/Favorites";
import Link from "next/link";
import Image from "next/image";

import ServiceCard from "./ServiceCard";


export default function Favorites_Section (){
    const {userEmail, userServices, setServices, favorites, setFavorites} = useAppContext();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selection, setSelection] = useState(null);
    console.log("FAVORITES: ")
    console.log(favorites);

    useEffect(() => {
        const fetchInfo = async () => {
            //replace this array with the values given by the database. 
            const ids = await getFavorites(userEmail[1]);
            const servicesInformation = [];
            const servicesCalls = ids.map(async id => {
                try {
                    const response = await fetch(`/api/maps/places?id=` + id.info );
                    if (response.ok) {
                        const {service_result} = await response.json();
                        if (service_result.photos)
                        try {
                            const img_response = await fetch(`/api/maps/places?thePhoto=` + service_result.photos[0].name);
                            if (img_response.ok) {
                                service_result.photoURL = img_response.url;
                                service_result.photo_image =  img_response.url;
                            }
                            service_result.id = id.info;
                            service_result.responses = id.response;
                            
                            return service_result;
                        }
                    catch(error) {
                        console.error("Error fetching service " + id.info + ":", error);
                    }
                }
        
            }
            catch(error) {
                console.error("Error fetching service " + id.info + ":", error);
            }});
            const waitCalls = await Promise.all(servicesCalls);
            waitCalls.forEach(result => { 
                if (result) servicesInformation.push(result)
            });
            console.log("SERVICES INFO ARRAY")
            console.log(servicesInformation);
            setFavorites(servicesInformation);
            setLoading(false);
        }
        if(!favorites)fetchInfo();

        }, []);





  
        return (
            <>
            {favorites ? 

            <div className="container mt-6">
                {favorites.length === 0 ? 
                <div className="text-content-text">
                    <div className="w-full flex justify-center">
                        <img className="rounded-lg bg-white/10 outline outline-1 outline-black p-1 opacity-80" src = "https://static.vecteezy.com/system/resources/thumbnails/013/713/828/small_2x/the-simple-twinkling-star-free-png.png" alt = "Star" width={100} height={100} />
                    </div>
                    <div className="text-center font-bold mt-6 text-2xl">
                        No Favorites Yet. 
                    </div> 
                    <div className="text-center mt-1">
                        Favorite your favorite services to see them here!
                    </div>  
                </div>
 
                :
                <div className="flex flex-row gap-4 overflow-y-auto">
                    {/* {favorites.map((service, index) => ( */}
                    {favorites.map((service, index) => (

                        <div key ={index} className="">
                            <div className="">
                            {userEmail != null && <Favorites service={service}/>}
                            </div> 
                            <div className="w-full max-w-2xs bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 shadow-lg transition ease-in-out delay-100 duration-400 hover:-translate-y-5 mt-5">
                                <div onClick={() => setSelection(index)} className = {`${selection == index ? "border-2 border-blue-200 cardAdjust": "card cardAdjust" }`} >
                                    <Image className = "size-75 object-cover rounded-t-xl" src= {error || !service.photoURL? "https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg": service.photoURL } width={100} height={100} onError={() => setError(true)} alt = "Service image" unoptimized = {true} />  
                                    <div className="flex items-center px-5 pb-5"> 
                                        <h4 className = {`${service.displayName.text.length > 25 ? "text-xl" : "text-2xl"} font-semibold tracking-tight text-gray-900 dark:text-white`}>{service.displayName.text}</h4>
                                    </div>
                                    <div className="flex items-center mt-2.5 mb-5">
                                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                            <svg className={service.rating >= 1? "w-4 h-4 text-yellow-300":"w-4 h-4 text-gray-200 dark:text-gray-600"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                            </svg>
                                            <svg className={service.rating >= 2? "w-4 h-4 text-yellow-300":"w-4 h-4 text-gray-200 dark:text-gray-600"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                            </svg>
                                            <svg className={service.rating >= 3? "w-4 h-4 text-yellow-300":"w-4 h-4 text-gray-200 dark:text-gray-600"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                            </svg>
                                            <svg className={service.rating >= 4? "w-4 h-4 text-yellow-300":"w-4 h-4 text-gray-200 dark:text-gray-600"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                            </svg>
                                            <svg className={service.rating >= 5? "w-4 h-4 text-yellow-300":"w-4 h-4 text-gray-200 dark:text-gray-600"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                            </svg>
                                        </div>
                                        
                                        
                                        <p className = "bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3"> Rating: {service.rating ? service.rating : "N/A" }</p> 
                    
                                    </div>
                                    <div className="flex items-center justify-between">
                                    {service.priceRange != null && <p className = "text-1x1 font-bold text-gray-900 dark:text-white">Price Range: {service.priceRange?.startPrice?.units?  "$" + service.priceRange.startPrice.units: "UNKNOWN"} 
                                                                                    {service.priceRange?.endPrice?.units? ("-$" + service.priceRange.endPrice.units): (service.priceRange?.startPrice? "-UNKNOWN": "") //this is checking if there are start and end prices. If there is neither, its only UNKNOWN. If start, then start price-UNKNOWN. If both, show both
                                                                                    }</p>}
                                    </div>

                                    {selection === index && 
                                            <Link href={"/start"}>
                                                <button onClick= {()=>{userServices.push(service)}}  className="ext-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-center">Start with this service</button>
                                            </Link>                          
                                        }
                            </div>
                        </div> 
                        </div>
                        
                    ))
                    }
                </div>
                }
                
            </div>
            :
            <Loading message= "Fetching Favorites"/>
            }
            </>
        )
    
}
