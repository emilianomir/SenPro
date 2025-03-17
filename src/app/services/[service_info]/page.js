"use client"
import ServicePageHeading from "@/components/ServicePageHeading";
import "../../css/services_page.css"
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import RouteButton from "@/components/route_button";
import { useEffect, useState } from "react";
import Image from "next/image";
import GenericSingleMap from "@/components/GenericSingleMap";
import Script from "next/script";



export default function ServiceInfo(){
    const {userServices, setServices, numberPlaces, userResponses} = useAppContext();
    const [wentBack, setBack] = useState(false); //used to check when the user leaves page in regards to our UI, not back arrow from browser 
    const [loading, setLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const current_service = userServices[userServices.length-1];
    const router = useRouter();

    const handleBack = ()=>{
        setBack(true);
    }

    const goToGallery = async ()=>{
        if (current_service.photoURLs == undefined) {
            const photoNames = []; 
            const photos_array = current_service.photos;
            for (let i = 1; i < photos_array.length; i ++){
                photoNames.push(photos_array[i].name);
            }
            const queryString = encodeURIComponent(JSON.stringify(photoNames));
            const response = await fetch(`/api/maps/places?thePhotos=${queryString}`);
            if (response.ok) {
                const {photoUrlList} = await response.json();
                current_service.photoURLs = photoUrlList;
                router.push(`/services/${current_service.displayName.text}/gallery`)
            }
            else {
                throw new Error(`HTTP error! Status: ${response.status}`);  
            }
        }
        else 
            router.push(`${router.pathname}/gallery`)
    }

    const handleEnter = ()=> { 
        router.push(numberPlaces == userServices.length ? "/end": "/questionaire") //checks to see if user reaches decided limit
    }
    useEffect(() => {
        const handleRouteChangeComplete = () => {
            if ((window.history.state && window.history.state.navigationDirection == "back") || wentBack)
                setServices(userServices.slice(0, userServices.length -1)); //goal is to remove current services from list of services that user selects
            if (wentBack){
                setBack(false);
                router.back(); //should be the services menu page since you can only reach this page by clicking a service in services menu
            }
        };
        handleRouteChangeComplete();
    }, [wentBack]
    );

    return(
        <div className="full_page bg-secondary">
              {/* <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&loading=async`}
                onLoad={() => setIsScriptLoaded(true)}
                strategy="afterInteractive"
            /> */}
            <ServicePageHeading />
            <div className="container mt-5">
                <div className="row row-cols-2 service_info">
                    <div className="col-4 h-100">
                        <h1 className="fs-1 text-white">Map:</h1>
                        <div className="h-100 bg-secondary-subtle">
                            <div className="bg-white map_place text-center">
                                Map Placeholder
                            </div>
                            {/* {userServices[userServices.length-1]?.formattedAddress ? (
                                <GenericSingleMap 
                                    address={userServices[userServices.length-1].formattedAddress}
                                    isLoaded={isScriptLoaded}
                                />
                            ):(<div className="text-center pt-3">Loading map...</div>)
                            } */}
                            <div className="">
                                <button className="fs-3 btn btn-primary w-100">Google Maps</button>
                            </div>
                        </div>

                    </div>

                    <div className="col-8 h-100">
                        <h1 className="fs-1 text-white">Info:</h1>
                        {userServices.length > 0 && //to prevent errors when scenario that there are no services in list
                        <div className="bg-secondary-subtle h-100">
                        <div className="fs-2 text-center pt-3 fw-bolder">{userServices[userServices.length-1].displayName.text}</div>
                        <div className="row row-cols-2">
                            <div className="col-5">
                                <div onClick={goToGallery} className="position-relative">
                                    <Image className = "service_images w-100 ms-2 mt-4" src= {!userServices[userServices.length-1].photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": userServices[userServices.length-1].photo_image} width={300} height={300} alt = "Service image" unoptimized = {true} />
                                    {current_service.photo_image && <div className="overlay">
                                        <div className="ms-2 position-absolute top-0 start-0 w-100 h-100 bg-secondary-subtle opacity-50">
                                        </div>
                                        <div className="position-absolute top-50 start-50 translate-middle fs-3 fw-bold">Gallery</div>
                                    </div>
                                    }
                                </div>
                                {current_service.fuelOptions != undefined ? 
                                    <div className="ms-2">
                                        <RouteButton name = {"Price"} location={`/services/${current_service.displayName.text}/fuel_prices`}/>
                                    </div>                                   
                                    :
                                    (userServices[userServices.length-1].websiteUri != undefined &&
                                        <div className="ms-2 w-100 text-center">
                                            <a href={userServices[userServices.length-1].websiteUri} target="_blank" rel="noopener">
                                            <button className="btn btn-primary w-100 fs-3">Website</button>
                                            </a>
                                        </div>)
                                }
                            </div>
                            <div className="col-7 row row-cols-1 mt-0">
                                <div className="col text-center ps-3">
                                    {userServices[userServices.length-1].regularOpeningHours?.weekdayDescriptions &&
                                    <div className="text-center mt-3">
                                        <div className="fw-bold fs-3">Weekly Operations:</div>
                                        {userServices[userServices.length-1].regularOpeningHours.weekdayDescriptions.map((desc, index)=>
                                            <div key = {[index, desc]} className="fs-5">{desc}</div>
                                        )}
                                    </div>
                                    }

                                    <div className="text-center mt-2 fs-3"> <b>Address:</b> {userServices[userServices.length-1].formattedAddress}</div>
             
                                </div>
                                <div className="col text-center row row-cols-2 p-0 ps-4 mt-2">  
                                    <div className="col text-center h-100" >
                                        <button onClick={handleBack} className="fs-3 btn btn-primary w-100 h-100">Back</button>
                                    </div>
                                    <div className="col h-100">
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
