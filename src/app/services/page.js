"use client"
import "../css/services_page.css"
import ServiceCard from "@/components/ServiceCard";
import ServicePageHeading from "@/components/ServicePageHeading";
import { useAppContext } from "@/context";
import { useEffect, useState } from "react";



export default function Services(){
    const {userResponses, apiServices, setAPIServices} = useAppContext();
    const [loading, setLoading] = useState(true);
    useEffect(()=> {
        let change = true;

        const getInfo = async ()=> {
            try {
                const response = await fetch('/api/maps/places', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({userResponses})
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const {services_result} = await response.json();
                console.log("Service result in services page: ");
                console.log(services_result);
                if (change){
                    setAPIServices(services_result);
                    setLoading(false);
                }
        
            }catch (error) {
                console.error("Error fetching API:", error);
                alert("There was an issue getting the data.");
            }
        }
        if (!apiServices)
            getInfo();
        return () => {
            change = false;
            };
    }, []);
 

   
    return (
        <div className="full_page bg-secondary">
            <ServicePageHeading />
            {(!apiServices && loading) && 
            <div className="bg-primary w-100 h-100">
                <div>Loading</div>
            </div> }
            {(apiServices || !loading) && 
                <>
                    <div className="container mt-4 ms-4">
                        <div className="fs-2 text-white fw-bold mb-3">
                            Selection:
                        </div>
                        <div className="row row-cols-5 circles mb-2">
                            <div className="col-2" >
                                <div className="h-100 rounded-circle bg-white w-50">
                                    <div className="d-flex justify-content-center align-items-center h-100 fs-4">
                                        Food
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="me-0 ms-4 ps-3">
                        <div className="fs-2 mt-3 text-white fw-bold mb-3">Choose your service: </div>               
                        <div className="scroll">
                            {apiServices.map((service_object, index)=>(
                                <div key ={index} className="d-inline-block me-4">                         
                                    <ServiceCard service = {service_object} /> 
                                </div>
                            ))}           
                        </div>  
                    </div>
                </>
            }
 
        </div>
    )
}