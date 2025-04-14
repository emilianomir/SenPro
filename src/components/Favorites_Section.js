"use client"
import { useAppContext } from "@/context"
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getFavorites } from '@/components/DBactions';
import Favorites from "@/components/Favorites";
import Image from "next/image"
import Link from "next/link";
import ServiceCard from "./ServiceCard";


export default function Favorites_Section ({favoritesList}){
    const {userEmail, userServices, setServices, favorites, setFavorites} = useAppContext();
    // const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selection, setSelection] = useState(null);
    console.log("FAVORITES: ")
    console.log(favorites);

    useEffect(() => {
        const fetchInfo = async () => {
            //replace this array with the values given by the database. 
            const ids = await getFavorites(userEmail[1]);
            if (!ids) 
                setFavorites([]);
            else {
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
                                    service_result.photo_image = img_response.url; 
                                }
                            }catch(error) {
                                console.error("Error fetching image for id " + id.info + ":", error);
                            }
                            service_result.id = id.info;
                            service_result.responses = id.response;
                            
                            return service_result;
                        }
                    }catch(error) {
                        console.error("Error fetching service " + id.info + ":", error);
                    }
                });
                const waitCalls = await Promise.all(servicesCalls);
                waitCalls.forEach(result => { 
                    if (result) servicesInformation.push(result)
                });
                console.log("SERVICES INFO ARRAY")
                console.log(servicesInformation);
                setFavorites(servicesInformation);
                //setLoading(false);
            }
        }
        
        if (!favorites)
            fetchInfo();
        }, []);


        return (
            <>
            {favorites ? 
                        <div className="mt-6">
                        {favorites.length === 0 ? 
                        <div>
                            <div className="w-full flex justify-center">
                                <img className="rounded-lg bg-white/10 outline outline-1 outline-black p-1 opacity-80" src = "https://static.vecteezy.com/system/resources/thumbnails/013/713/828/small_2x/the-simple-twinkling-star-free-png.png" alt = "Star" width={100} height={100} />
                            </div>
                            <div className="text-center font-bold mt-6 text-white text-2xl">
                                No Favorites Yet. 
                            </div> 
                            <div className="text-center mt-1 text-white">
                                Favorite your favorite services to see them here!
                            </div>  
                        </div>
         
                        :
                        <div className="whitespace-nowrap overflow-x-auto flex md:justify-center w-full">
                            {/* {favorites.map((service, index) => ( */}
                            {favorites.map((service, index) => (
                                <div key ={service.id} className={`inline-block ${favorites.length > 1 && "me-3"}`}>
                                    <Favorites service={service} responses={service.responses}/>
                                    {selection === index && 
                                        <Link href={"/start"}>
                                            <button onClick= {()=>{setServices([...userServices, service])}}  className="outline-2 ms-4 p-1 rounded">Start with this service</button>
                                        </Link>                          
                                    }
                                    <div onClick={() => setSelection(index)} className = {` ${selection == index ? "mt-2 rounded-2xl border-5 border-blue-600": "border-0" } h-110 md:h-125 `} >
                                        <ServiceCard  service={service} has_fuel_type={null} haveTransition= {false} decrease_text = {true}/>
                                    </div>
                                   
                                
                                </div>  
                            ))
                            }
                        </div>
                        }
                        
                    </div>
                    :
                    <Loading message={"Getting Favorites"} />
                    }
            </>

        )
    
}