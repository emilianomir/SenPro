"use client"
import "../app/css/service_card.css"
import Link from "next/link";
import { useAppContext } from "@/context";

function ServiceCard({service}){
    const [_, setService] = useAppContext();

    const handleServiceSelect = ()=>{
        setService(service);
    }

    return (
        <Link href = {"/services/" + service.name} >
            <div onClick={handleServiceSelect} className = "card cardAdjust">
                <img className = "card-img-top img-fluid imageAdjust" src= {service.image}/>
                <div className ="card-body">
                    <h4 className = "card-title">{service.name}</h4>
                    <p className = "card-text fs-4">Rating: {service.rating} <img  width = "10%" height = "50%" src = "https://th.bing.com/th/id/R.3462ebc891558b2ec8bde920fc3e41c1?rik=E8O%2fhD3daKvtqQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fyellow-stars-png-hd-hd-quality-wallpaper-collection-pattern-2000x2000-star-2000.png&ehk=c3jJXJdBQ08FuZM9zuSX6iQGLOq3E56vFYYk59%2fe39I%3d&risl=&pid=ImgRaw&r=0"/></p>
                    <p className = "card-text fs-4">Distance: {service.dist}</p>
                </div>
            </div>
         </Link>
   
        );
}

export default ServiceCard;