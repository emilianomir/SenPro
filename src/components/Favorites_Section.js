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

            <div className="w-full flex justify-center h-1/3 mt-6">
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
                <div className="overflow-x-auto whitespace-nowrap h-9/10 gap-4">
                    {/* {favorites.map((service, index) => ( */}
                    {favorites.map((service, index) => (

                        <div key ={service.id} className="h-full inline-block mr-3 max-sm:ml-3">
                            <div className="">
                            {userEmail != null && <Favorites service={service}/>}
                            </div> 
                            <div className="h-115 w-full max-w-2xs rounded-lg shadow-sm bg-land-card shadow-lg transition ease-in-out delay-100 duration-400 mt-5">
                                <div onClick={() => setSelection(index)} className = {`${selection == index ? "border-1 border-blue-300 rounded-t-xl cardAdjust": "card cardAdjust" }`} >
                                    <Image className = "size-75 object-cover rounded-t-xl" src= {error || !service.photo_image? "https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg": service.photo_image } width={50} height={50} onError={() => setError(true)} alt = "Service image" unoptimized = {true} />  
                                    <div className="h-1/2">
                                        <div className="text-center flex justify-center items-center h-15"> 
                                            <h4 className = {`${service.displayName.text.length > 25 ? "text-xl" : "text-2xl"} font-semibold tracking-tight text-content-text`}>{service.displayName.text}</h4>
                                        </div>
                                        <div className="flex justify-center mt-2.5 mb-5 h-1/2">
                                        <p className = "bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-sm text-lg ml-2"> Rating: {service.rating ? service.rating : "N/A" }
                                            <svg className={"w-5 h-5 text-yellow-300 ml-1 inline pb-1"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                            </svg>
                                        </p> 
                                        </div>
                                        {selection === index && 
                                                <Link href={"/start"}>
                                                    <div className="w-full flex justify-center">
                                                    <button onClick= {()=>{userServices.push(service)}}  className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-center">Start with this service</button>
                                                    </div>
                                                </Link>                          
                                        }
                                    </div>

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
