import { useAppContext } from "@/context"
import { useEffect, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SelectFavorites(){
    const { favorites, userServices} = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    console.log(favorites);

    return (
        <div className="mt-10 w-full flex justify-center">
            <button className="outline outline-2 text-2xl py-2 px-3" onClick={()=>setIsOpen(true)}>View Favorites</button>
            
            <div className={`${isOpen ? "opacity-100 z-2" : "opacity-0 -z-2"} ease-out duration-300 fixed inset-0 flex items-center justify-center bg-black/50`}>
                <div className={`${isOpen ? "opacity-100": "opacity-0"} transition-opacity ease-in-out duration-500 bg-white p-6 rounded-lg shadow-lg w-5/6`}>
                    <h2 className="text-3xl font-bold text-black">Choose your service:</h2>
                    <div className="scroll">
                        {favorites && favorites.length > 0 ? favorites.map((service_object, index)=>(
                        <div className="inline-block mr-7" key ={index}>
                            
                            <div onClick={() => getMoreInfo(index)} > 
                                <ServiceCard service = {service_object} has_fuel_type={service_object.fuel_type}/> 
                            </div>
                            
                            {/* <div className="card-footer">
                                {service_object.attributes &&     
                                <p className="fs-6 text-wrap">Info by: <a href= {service_object.attributes.providerUri}> {service_object.attributes.provider} </a> </p> }
                                {service_object.photos && service_object.photos[0].authorAttributions[0] &&     
                                <p className="fs-6 text-wrap">Image By: <a href= {service_object.photos[0].authorAttributions[0].uri}> {service_object.photos[0].authorAttributions[0].displayName} </a> </p> }
                            </div> */}
                        </div>
                            
                        )):    
                        <div className="text-center mt-4"> 
                            <div className="text-xl mb-5 text-black">No favorites yet</div>
                        </div>
                        }
        
                    </div> 
                    <button
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsOpen(false)}
                    >
                    Close
                    </button>
                </div>
            </div>

        </div>


    
    )
}