"use client"
import "../app/css/service_card.css"
import Link from "next/link";
import { useAppContext } from "@/context";

function ServiceCard({service, userClick}){
<<<<<<< HEAD
    const {userServices, setServices} = useAppContext();

    const handleServiceSelect = ()=>{
        userClick();
        setServices([...userServices, service]);
=======
    const {setServices} = useAppContext();

    const handleServiceSelect = ()=>{
        userClick();
        setServices(service);
>>>>>>> origin/main
    }

    return (
        <Link href = {"/services/" + service.displayName.text} >
            <div onClick={handleServiceSelect} className = "card cardAdjust">
                <div className ="card-body">
                    <img className = "card-img-top img-fluid fixHeight" src= {service.photo_image}/>  
                    <h4 className = "card-title text-wrap pt-3 titleHeight mb-4">{service.displayName.text}</h4>
                    <div className="d-flex align-items-center">
                        <p className = "card-text fs-4"> Rating: {service.rating ? service.rating : "N/A" }</p> 
                        {service.rating && <img className="ms-2 pb-3"  width = "10%" height = "50%" src = "https://th.bing.com/th/id/R.3462ebc891558b2ec8bde920fc3e41c1?rik=E8O%2fhD3daKvtqQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fyellow-stars-png-hd-hd-quality-wallpaper-collection-pattern-2000x2000-star-2000.png&ehk=c3jJXJdBQ08FuZM9zuSX6iQGLOq3E56vFYYk59%2fe39I%3d&risl=&pid=ImgRaw&r=0"/>}
                    </div>
  
                    <p className = "card-text fs-4 text-wrap">Price Range: {service.priceRange?.startPrice?.units?  "$" + service.priceRange.startPrice.units: "UNKNOWN"} 
                                                                 {service.priceRange?.endPrice?.units? ("-$" + service.priceRange.endPrice.units): (service.priceRange?.startPrice? "-UNKNOWN": "") }</p>
                </div>
            </div>
         </Link>
        
        );
}

export default ServiceCard;