import { useAppContext } from "@/context"
import { useEffect, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { useRouter } from "next/navigation";
import { Modal } from 'bootstrap';
import Link from "next/link";


export default function SelectFavorites(){
    const { favorites, userServices} = useAppContext();
    const [clickedService, setClicked] = useState(false);





    return (
        <div className="container">
            <div className="container">
            <button className='btn btn-primary w-25' data-bs-toggle="modal" data-bs-target="#reg-modal">View Favorites</button>
            </div>



            <div className="modal fade modal-xl" id="reg-modal" tabIndex="-1" aria-labelledby="modal-title" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title" id="modal-title">
                            Choose your service:
                            </div> 
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                        {clickedService && 
                            <span className="justify-content-center position-absolute start-50 translate-middle-x">
                                <span className="text-center">Loading...</span>
                            </span>
                            }
                        <div className="scroll">
                                {favorites ? favorites.map((service_object, index)=>(
                                    <div key ={index} className="d-inline-block me-4" >
                                        <Link href={"/services/" + service_object.displayName.text}> 
                                        <div onClick={() => {
                                            setClicked(true);
                                            userServices.push(service_object);
                                            }} data-bs-dismiss="modal">   
                                        <ServiceCard service = {service_object} has_fuel_type={null}/> 
                                        </div>
                                        </Link> 
                                    </div>
                                )):    
                                <div className="text-center"> 
                                    <div className="fs-1 text-white loadingSection">No services avaiable based on response. Try to search again </div>
                                </div>
                                }
        
                            </div> 
                        </div>  
                        <div className="modal-footer">
                        </div>

                    </div>
                </div>
            </div>
        </div>


    
    )
}