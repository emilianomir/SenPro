"use client"
import { useAppContext } from "@/context"
import ServicePageHeading from "@/components/ServicePageHeading";
import Image from "next/image";
import "../css/end_page.css"

export default function End(){
    const {userServices, numberPlaces} = useAppContext(); //this should have the full list of services once the user reaches decided number of services
                                        
    return(
        <div>
            <ServicePageHeading />
            <div className="container text-center text-white fs-2 mt-3 fw-bold">Here is your services list:</div>
            <div className="container d-flex justify-content-center mt-4 scroll">
                {userServices.map((theService, index)=>(
                    <div key = {[theService, index]} className=" bg-secondary-subtle final_result me-3 border border-5 border-white"> 
                        <div className="d-flex justify-content-center align-items-center final_result_text"> 
                            <h3 className="text-center fw-bold p-3 text-wrap">{theService.displayName.text}</h3>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Image className = "final_result_photo" src= {!theService.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": theService.photo_image} width={300} height={300} alt = "Service image" unoptimized = {true} />
                        </div>
                        <div className="d-flex justify-content-center align-items-center p-3"> 
                            <div className="text-center fs-4 text-wrap">{theService.formattedAddress}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}