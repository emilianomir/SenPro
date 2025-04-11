"use client"
import "../app/css/service_card.css"
// import Link from "next/link";
import { useAppContext } from "@/context";
import Image from "next/image";
import { useState } from "react";

function ServiceCard({service, has_fuel_type}){
    // const {userServices, userResponses} = useAppContext();
    const [error, setError] = useState(false);
    let theFuel = null; 
    if (service.fuelOptions != undefined && has_fuel_type != null){//this checks to see if the user selected a fuel option in questionnaire and the object returned has that fuel type
        for (let fuelTypes of service.fuelOptions.fuelPrices){
            if (fuelTypes.type === has_fuel_type){
                theFuel = fuelTypes;
            }
        }
    }
    // const handleServiceSelect = ()=>{
    //     userServices.push(service); //adds the current service to it only on click
    // }

    return (
        // <Link href = {"/services/" + service.displayName.text} >
                <div className="h-full group max-w-2xs rounded-xl bg-white mt-5 shadow-lg transition ease-in-out delay-100 duration-400 hover:-translate-y-5">
                    <Image className = "h-11/20 object-cover rounded-t-xl" src= {error || !service.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": service.photo_image} width={300} height={300} onError={() => setError(true)} alt = "Service image" unoptimized = {true} />  
                    <div className="h-9/20 rounded-b-xl border border-2 border-gray-200/50 group-hover:bg-gray-200/80 transition-colors ease-in-out duration-500">
                        <div className="h-1/2 flex w-full items-center justify-center">
                            <h4 className = {`text-black ${service.displayName.text.length > 25 ? "text-xl" : "text-2xl"} text-wrap p-3 font-extrabold text-center`}>{service.displayName.text}</h4>
                        </div>
                        <div className="text-gray-700/90 text-xl/8 text-wrap pb-3 pl-2 h-1/2">
                            <div className="flex">
                                <p> Rating: {service.rating ? service.rating + "/5" : "N/A" }</p> 
                                {service.rating &&
                                <>
                                    <img className="inline-block w-1/15 h-1/10 pt-1 ml-1" 
                                    src = "https://th.bing.com/th/id/R.3462ebc891558b2ec8bde920fc3e41c1?rik=E8O%2fhD3daKvtqQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fyellow-stars-png-hd-hd-quality-wallpaper-collection-pattern-2000x2000-star-2000.png&ehk=c3jJXJdBQ08FuZM9zuSX6iQGLOq3E56vFYYk59%2fe39I%3d&risl=&pid=ImgRaw&r=0"/>
                                    {service.userRatingCount && <div className="ml-2">{`(${service.userRatingCount})`}</div> }
                                </>

                                }

                            </div>
                            {theFuel ? 
                            <div >
                                <div className="font-bold">{theFuel.type}</div>
                                <div>Current Price: <span className="font-bold">{theFuel.price.currencyCode == "USD" && "$"} {Number(theFuel.price.units) + (theFuel.price.nanos ? theFuel.price.nanos/1000000000: 0)}</span></div>
                            </div>
                            :
                            <div >Price Range:
                                <div> 
                                    {service.priceRange?.startPrice?.units?  "$" + service.priceRange.startPrice.units: "UNKNOWN"} 
                                    {service.priceRange?.endPrice?.units? ("-$" + service.priceRange.endPrice.units): (service.priceRange?.startPrice? "-UNKNOWN": "") //this is checking if there are start and end prices. If there is neither, its only UNKNOWN. If start, then start price-UNKNOWN. If both, show both
                                    }
                                </div>
                            </div>
                            }
                        </div>

                    </div>
               



                </div>
           
        //  </Link>
        
        );
}

export default ServiceCard;