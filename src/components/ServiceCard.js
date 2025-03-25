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
            <div  className = "card cardAdjust">
                <div className ="card-body">
                    <Image className = "card-img-top img-fluid fixHeight" src= {error || !service.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": service.photo_image} width={300} height={300} onError={() => setError(true)} alt = "Service image" unoptimized = {true} />  
                    <h4 className = "card-title text-wrap pt-3 titleHeight mb-4">{service.displayName.text}</h4>
                    <div className="d-flex align-items-center">
                        <p className = "card-text fs-4"> Rating: {service.rating ? service.rating : "N/A" }</p> 
                        {service.rating && <img className="ms-2 pb-3"  width = "10%" height = "50%" 
                        src = "https://th.bing.com/th/id/R.3462ebc891558b2ec8bde920fc3e41c1?rik=E8O%2fhD3daKvtqQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fyellow-stars-png-hd-hd-quality-wallpaper-collection-pattern-2000x2000-star-2000.png&ehk=c3jJXJdBQ08FuZM9zuSX6iQGLOq3E56vFYYk59%2fe39I%3d&risl=&pid=ImgRaw&r=0"/>}
                        {service.userRatingCount && <div className="fs-4 pb-3 ps-2">{`(${service.userRatingCount})`}</div>}
                    </div>
                    {theFuel ? 
                    <div className="card-text fs-5 text-wrap">
                        <div className="fw-bold">{theFuel.type}</div>
                        <div>Current Price: <span className="fw-bold">{theFuel.price.currencyCode == "USD" && "$"} {Number(theFuel.price.units) + (theFuel.price.nanos ? theFuel.price.nanos/1000000000: 0)}</span></div>
                    </div>
                    :
                    <p className = "card-text fs-4 text-wrap">Price Range: {service.priceRange?.startPrice?.units?  "$" + service.priceRange.startPrice.units: "UNKNOWN"} 
                    {service.priceRange?.endPrice?.units? ("-$" + service.priceRange.endPrice.units): (service.priceRange?.startPrice? "-UNKNOWN": "") //this is checking if there are start and end prices. If there is neither, its only UNKNOWN. If start, then start price-UNKNOWN. If both, show both
                    }</p>
                    }

                </div>
            </div>
        //  </Link>
        
        );
}

export default ServiceCard;