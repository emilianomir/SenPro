import { useAppContext } from "@/context"
import { useEffect, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { useRouter } from "next/navigation";
import { Modal } from 'bootstrap';
import Link from "next/link";
import Image from "next/image";


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
                                        <div className ="card-body">
                                            <Image className = "card-img-top img-fluid fixHeight" src= { !service_object.photoURL? "https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg": service_object.photoURL } width={100} height={100} onError={() => setError(true)} alt = "Service image" unoptimized = {true} />  
                                            <h4 className = "card-title text-wrap pt-3 titleHeight mb-4">{service_object.displayName.text}</h4>
                                            <div className="d-flex align-items-center">
                                                <p className = "card-text fs-4"> Rating: {service_object.rating ? service_object.rating : "N/A" }</p> 
                                                {service_object.rating && <img className="ms-2 pb-3"  width = "10%" height = "50%" src = "https://th.bing.com/th/id/R.3462ebc891558b2ec8bde920fc3e41c1?rik=E8O%2fhD3daKvtqQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fyellow-stars-png-hd-hd-quality-wallpaper-collection-pattern-2000x2000-star-2000.png&ehk=c3jJXJdBQ08FuZM9zuSX6iQGLOq3E56vFYYk59%2fe39I%3d&risl=&pid=ImgRaw&r=0"/>}
                                            </div>
                            
                                            <p className = "card-text fs-4 text-wrap">Price Range: {service_object.priceRange?.startPrice?.units?  "$" + service_object.priceRange.startPrice.units: "UNKNOWN"} 
                                                                                            {service_object.priceRange?.endPrice?.units? ("-$" + service_object.priceRange.endPrice.units): (service_object.priceRange?.startPrice? "-UNKNOWN": "") //this is checking if there are start and end prices. If there is neither, its only UNKNOWN. If start, then start price-UNKNOWN. If both, show both
                                                                                            }</p>
                                        </div> 
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