"use client"
import ServicePageHeading from "@/components/ServicePageHeading";
import "../../css/services_page.css"
import { useAppContext } from "@/context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GenericSingleMap from "@/components/GenericSingleMap";
import Script from "next/script";

export default function ServiceInfo(){
    const {userServices, setServices} = useAppContext();
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const router = useRouter();

    const handleBack = ()=>{
        router.back();
    }

    useEffect(() => {
        const handleRouteChangeComplete = () => {
          setServices(null);
        };
    }, []);

    return(
        <div className="full_page bg-secondary">
              <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places&loading=async`}
                onLoad={() => setIsScriptLoaded(true)}
                strategy="afterInteractive"
            />
            <ServicePageHeading />
            <div className="container mt-5">
                <div className="row row-cols-2 service_info">
                    <div className="col-4 h-100">
                        <h1 className="fs-1 text-white">Map:</h1>
                        <div className="h-100 bg-secondary-subtle">
                            {userServices?.formattedAddress ? (
                                <GenericSingleMap 
                                    address={userServices.formattedAddress}
                                    isLoaded={isScriptLoaded}
                                />
                            ):(<div className="text-center pt-3">Loading map...</div>)
                            }
                        </div>
                    </div>

                    <div className="col-8 h-100">
                        <h1 className="fs-1 text-white">Info:</h1>
                        <div className="bg-secondary-subtle h-100">
                            <div className="fs-3 text-center pt-3">{userServices.displayName.text}</div>
                            <div className="row row-cols-2 mt-4">
                                <div className="col-5">
                                    <img className = "service_images w-100 ms-2" src = {userServices.photo_image}/>

                                </div>
                                <div className="col-7 row row-cols-1">
                                    <div className="col text-center pt-3 ps-3">
                                        <div className="text-center mt-3 fs-3">Address: {userServices.formattedAddress}</div>
                                        <div className="col">
                                            <button className="fs-3 btn btn-primary w-100 mt-4">Google Maps</button>
                                        </div>
                                    </div>
                                    <div className="col text-center row row-cols-2 p-0 ps-4">  
                                        <div className="col text-center h-50" >
                                            <button onClick={handleBack} className="fs-3 btn btn-primary w-100 h-100">Back</button>
                                        </div>
                                        <div className="col h-50">
                                            <Link href={"/questionaire"}>
                                                <button className="fs-3 btn btn-primary w-100 h-100">Next</button>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    );
}
