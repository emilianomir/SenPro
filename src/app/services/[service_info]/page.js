"use client"
import ServicePageHeading from "@/components/ServicePageHeading";
import "../../css/services_page.css"
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'


export default function ServiceInfo(){
    const {userServices, setServices, numberPlaces} = useAppContext();
    const [wentBack, setBack] = useState(false);
    const router = useRouter();

    const searchParams = useSearchParams();
    const search = searchParams.get('user');

    const handleBack = ()=>{
        setBack(true);
    }

    const handleEnter = ()=> {
        router.push(numberPlaces == userServices.length ? "/end": "/questionaire")
    }
    useEffect(() => {
        const handleRouteChangeComplete = () => {
            if ((window.history.state && window.history.state.navigationDirection == "back") || wentBack)
                setServices(userServices.slice(0, userServices.length -1));
            if (wentBack){
                setBack(false);
                router.back();
            }
        };
        handleRouteChangeComplete();
    }, [wentBack]
    );

    return(
        <div className="full_page bg-secondary">
            <ServicePageHeading/>
            <div className="container mt-5">
                <div className="row row-cols-2 service_info">
                    <div className="col-4 h-100">
                        <h1 className="fs-1 text-white">Map:</h1>
                        <div className="h-100 bg-secondary-subtle">MAP API HERE</div>
                    </div>

                    <div className="col-8 h-100">
                        <h1 className="fs-1 text-white">Info:</h1>
                        {userServices.length > 0 && 
                        <div className="bg-secondary-subtle h-100">
                        <div className="fs-3 text-center pt-3">{userServices[userServices.length-1].displayName.text}</div>
                        <div className="row row-cols-2 mt-4">
                            <div className="col-5">
                                <img className = "service_images w-100 ms-2" src = {userServices[userServices.length-1].photo_image}/>

                            </div>
                            <div className="col-7 row row-cols-1">
                                <div className="col text-center pt-3 ps-3">
                                    <div className="text-center mt-3 fs-3">Address: {userServices[userServices.length-1].formattedAddress}</div>
                                    <div className="col">
                                        <button className="fs-3 btn btn-primary w-100 mt-4">Google Maps</button>
                                    </div>
                                </div>
                                <div className="col text-center row row-cols-2 p-0 ps-4">  
                                    <div className="col text-center h-50" >
                                        <button onClick={handleBack} className="fs-3 btn btn-primary w-100 h-100">Back</button>
                                    </div>
                                    <div className="col h-50">
                                        <button onClick={handleEnter} className="fs-3 btn btn-primary w-100 h-100">Next</button>
                                    </div>
                                </div>

                                </div>
                            </div>
                        </div> 
                        }

                    </div>
                </div> 
            </div>
        </div>
    );
}