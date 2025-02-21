"use client"
import ServicePageHeading from "@/components/ServicePageHeading";
import "../../css/services_page.css"
import { useAppContext } from "@/context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function ServiceInfo(){
    const [userServices, changeService] = useAppContext();
    const router = useRouter();

    const handleBack = ()=>{
        router.back();
    }

    useEffect(() => {
        const handleRouteChangeComplete = () => {
          setService(null);
        };
    }
    )

    return(
        <div className="full_page bg-secondary">
            <ServicePageHeading />
            <div className="container mt-5">
                <div className="row row-cols-2 service_info">
                    <div className="col-4 h-100">
                        <h1 className="fs-1 text-white">Map:</h1>
                        <div className="h-100 bg-secondary-subtle">MAP API HERE</div>
                    </div>

                    <div className="col-8 h-100">
                        <h1 className="fs-1 text-white">Info:</h1>
                        <div className="bg-secondary-subtle h-100">
                            <div className="fs-3 text-center pt-3">{userServices.name}</div>
                            <div className="row row-cols-2 mt-4">
                                <div className="col-5">
                                    <img src = {userServices.image}/>
                                </div>
                                <div className="col-7 row row-cols-1 mt-5">
                                    <div className="col text-center">
                                        <button className="fs-2 w-100 h-75 btn btn-primary">Google Maps</button>
                                    </div>
                                    <div className="col text-center">
                                        <Link href={"/questionaire"}>
                                            <button className="fs-2 w-100 h-75 btn btn-primary">Next</button>
                                        </Link>
                                    </div>
                                    <div className="col text-center">

                                        <button onClick={handleBack} className="fs-2 w-100 h-75 btn btn-primary">Back</button>
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