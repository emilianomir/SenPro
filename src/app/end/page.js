"use client"
import { useAppContext } from "@/context"
import ServicePageHeading from "@/components/ServicePageHeading";
import Image from "next/image";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getUserSession, getInfoSession, createStatelessQ, deleteSession} from '@/components/DBactions';
import "../css/end_page.css"
import { useRouter } from 'next/navigation'
import { users } from "@/db/schema/users";


export default function End(){
    const {userServices, numberPlaces, userEmail, setUserEmail, setServices, setAPIServices, setFavorites,favorites, apiServices, userResponses, setResponses} = useAppContext(); //this should have the full list of services once the user reaches decided number of services
    const [yes, setyes] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const fetchProducts = async () => {
        if (yes){
            try{
            setyes(false);
            let userName = await getUserSession();
            if (userName != null) setUserEmail([userName[0].username, userName[0].email]);
            let sessionValues = await getInfoSession();
            if(sessionValues == null || numberPlaces > 0)
            {

                if(numberPlaces > 0) await deleteSession('Qsession');
                let email = "HASHTHIS";
                if(userName)
                {
                    email = userName[0].email;
                }
                console.log(await createStatelessQ(numberPlaces, favorites, userServices, apiServices, userResponses, email));
            }
            else
            {
                setFavorites(sessionValues.favorites);
                setServices(sessionValues.userServices);
                setResponses(sessionValues.userResponses);
                setAPIServices(sessionValues.apiServices);
            }
            } catch(error) {
                console.error("Error fetching DB:", error);
                alert("There was an issue getting the data.");
            } finally {
            setLoading(false);
            }
        }
        }
        fetchProducts();
    }, [yes]);
            
    

    
    if(loading){
        return (<Loading message= "Fetching Session"/>)
    }
    return(
        <div>
            <ServicePageHeading />
            <div className="container text-center text-white fs-2 mt-3 fw-bold">Here is your services list:</div>
            <div className="container d-flex justify-content-center mt-4 scroll">
                {userServices.map((theService, index)=>(
                    <div key = {theService.id ? theService.id : index} className=" bg-secondary-subtle final_result me-3 border border-5 border-white"> 
                        <div className="d-flex justify-content-center align-items-center final_result_text"> 
                            <h3 className="text-center fw-bold p-3 text-wrap">{theService.displayName.text}</h3>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Image className = "final_result_photo" src= {!theService.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": theService.photo_image} width={300} height={300} alt = "Service image" unoptimized = {true} />
                        </div>
                        <div className="d-flex justify-content-center align-items-center p-3"> 
                            <div className="text-center fs-4 text-wrap">{theService.formattedAddress}</div>
                        </div>
                        {/* {theService.attributes &&     
                        <p className="fs-6 text-wrap">Info by: <a href= {service_object.attributes.providerUri}> {service_object.attributes.provider} </a> </p> }
                        {theService.photos && service_object.photos[0].authorAttributions[0] &&     
                        <p className="fs-6 text-wrap card-footer">Image By: <a href= {service_object.photos[0].authorAttributions[0].uri}> {service_object.photos[0].authorAttributions[0].displayName} </a> </p> } */}
                    </div>
                ))}
            </div>
        </div>

    )
}