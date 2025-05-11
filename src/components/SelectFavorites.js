import { useAppContext } from "@/context"
import { useEffect, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SelectFavorites(){
    const {favorites, userServices} = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [clicked, setClicked] = useState(false);
    const router = useRouter();


    const getMoreInfo = async (id) =>{
        const desired_service = favorites.find(obj => obj.id === id);
        if (!desired_service.hasFullInfo) {
            setClicked(true);
            try {
                const response = await fetch(`/api/maps/places?id=` + desired_service.id + "&partial=true");
                if (response.ok) {
                    const {service_result} = await response.json();
                    for (const [key, value] of Object.entries(service_result)){
                        desired_service[key] = value;
                    desired_service.hasFullInfo = true;
                    }
                }
            }catch(error) {
                console.error("Error fetching service " + desired_service.id + ":", error);
            }


        }
        userServices.push(desired_service);
        router.push("/services/" + desired_service.displayName.text);
    }

    return (
        <div className="mt-5 md:mt-10 w-full flex justify-center">
            <button className="text-content-text outline-2 text-xl md:text-2xl py-2 px-3" onClick={()=>setIsOpen(true)}>View Favorites</button>
            
            <div className={`${isOpen ? "opacity-100 z-2" : "opacity-0 -z-2"} ease-out duration-300 fixed inset-0 flex items-center justify-center bg-black/50`}>
                <div className={`${isOpen ? "opacity-100": "opacity-0"} transition-opacity ease-in-out duration-500 bg-land-sec-bg p-6 rounded-lg shadow-lg w-5/6 h-4/5 relative`}>
                    <h2 className="text-3xl font-bold text-content-text">{clicked ? "Loading..." : "Choose your service:"}</h2>
                    <div className="overflow-x-auto whitespace-nowrap h-9/10">
                        {favorites && favorites.length > 0 ? favorites.map((service_object)=>(
                        <div className="inline-block mr-3" key ={service_object.id}>
                            
                            <div className="h-100 md:h-125" onClick={() => getMoreInfo(service_object.id)} > 
                                <ServiceCard service = {service_object} has_fuel_type={null} decrease_text = {true}/> 
                            </div>
                            
                            {/* <div className="card-footer">
                                {service_object.attributes &&     
                                <p className="fs-6 text-wrap">Info by: <a href= {service_object.attributes.providerUri}> {service_object.attributes.provider} </a> </p> }
                                {service_object.photos && service_object.photos[0].authorAttributions[0] &&     
                                <p className="fs-6 text-wrap">Image By: <a href= {service_object.photos[0].authorAttributions[0].uri}> {service_object.photos[0].authorAttributions[0].displayName} </a> </p> }
                            </div> */}
                        </div>
                            
                        )):    
                        <div className="text-center mt-4 h-full flex flex-col items-center justify-center"> 
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
                        }
        
                    </div> 
                    <button
                    className="bg-red-500 text-white px-4 py-2 rounded absolute top-0 right-0 mr-2 mt-2"
                    onClick={() => setIsOpen(false)}
                    >
                    Close
                    </button>
                </div>
            </div>

        </div>


    
    )
}