"use client"
import { useAppContext } from "@/context"
import "../app/css/service_card.css"
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getFavorites } from '@/components/DBactions';
import Favorites from "@/components/Favorites";
import Image from "next/image"
import "../app/css/services_page.css"
import Link from "next/link";


export default function Favorites_Section ({favoritesList}){
    const {userEmail, userServices, favorites, setFavorites} = useAppContext();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selection, setSelection] = useState(null);


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
            setLoading(false);
        }
            fetchInfo();
        }, []);











/*
    useEffect(() => {
        const fetchInfo = async () => {
            try{
                const fav = await getFavorites(userEmail[1]);
                setFavorites(fav.map(element => JSON.parse(element.info)));
                } catch(error) {
                    console.error("Error fetching DB:", error);
                    alert("There was an issue getting the data.");
                } finally {
                    setLoading(false);
                }
            }
            fetchInfo();
        }, []);

*/


        /*
        favoritesList.length = 0;
        favorites.forEach(element => {
            const val = JSON.parse(element.info);
            favoritesList.push(val);
            console.log(favoritesList)
        })
        */

    if(isLoading){
        return (<Loading message= "Fetching Favorites"/>)
    }
    else{
        return (

            <div className="container mt-6">
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
                <div className="scroll">
                    {/* {favorites.map((service, index) => ( */}
                    {favorites.map((service, index) => (
                        <div key ={index} className="d-inline-block me-5">
                            <Favorites service={service} responses={service.responses}/>
                            {selection === index && 
                                <Link href={"/start"}>
                                    <button onClick= {()=>{userServices.push(service)}}  className="btn btn-primary ms-4">Start with this service</button>
                                </Link>                          
                            }
                            <div onClick={() => setSelection(index)} className = {`${selection == index ? "card cardAdjust border-5 border-info": "card cardAdjust" }`} >
                                <div className ="card-body">
                                    <Image className = "card-img-top img-fluid fixHeight" src= {error || !service.photoURL? "https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg": service.photoURL } width={100} height={100} onError={() => setError(true)} alt = "Service image" unoptimized = {true} />  
                                    <h4 className = "card-title text-wrap pt-3 titleHeight mb-4">{service.displayName.text}</h4>
                                    <div className="d-flex align-items-center">
                                        <p className = "card-text fs-4"> Rating: {service.rating ? service.rating : "N/A" }</p> 
                                        {service.rating && <img className="ms-2 pb-3"  width = "10%" height = "50%" src = "https://th.bing.com/th/id/R.3462ebc891558b2ec8bde920fc3e41c1?rik=E8O%2fhD3daKvtqQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fyellow-stars-png-hd-hd-quality-wallpaper-collection-pattern-2000x2000-star-2000.png&ehk=c3jJXJdBQ08FuZM9zuSX6iQGLOq3E56vFYYk59%2fe39I%3d&risl=&pid=ImgRaw&r=0"/>}
                                    </div>
                    
                                    <p className = "card-text fs-4 text-wrap">Price Range: {service.priceRange?.startPrice?.units?  "$" + service.priceRange.startPrice.units: "UNKNOWN"} 
                                                                                    {service.priceRange?.endPrice?.units? ("-$" + service.priceRange.endPrice.units): (service.priceRange?.startPrice? "-UNKNOWN": "") //this is checking if there are start and end prices. If there is neither, its only UNKNOWN. If start, then start price-UNKNOWN. If both, show both
                                                                                    }</p>
                                </div>
                            </div>
                           
                        
                        </div>  
                    ))
                    }
                </div>
                }
                
            </div>
        )
    }
}