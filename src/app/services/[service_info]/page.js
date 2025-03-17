"use client"
import ServicePageHeading from "@/components/ServicePageHeading";
import "../../css/services_page.css"
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addService, addHistoryService } from '@/components/DBactions';
import GenericSingleMap from "@/components/GenericSingleMap";
import Script from "next/script";
import { users } from "@/db/schema/users";



export default function ServiceInfo(){
    const {userServices, setServices, numberPlaces, userEmail} = useAppContext();
    const [wentBack, setBack] = useState(false); //used to check when the user leaves page in regards to our UI, not back arrow from browser
    const [moreThan1, setMoreThan1] = useState(false);

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const router = useRouter();
    const [addServices, setYes] = useState(false)

    const handleBack = ()=>{
        setBack(true);
    }

    //checks to see if user reaches decided limit
    const handleEnter = ()=> { 
        if (numberPlaces == userServices.length)
            setYes(true);
        else
            router.push("/questionaire") //checks to see if user reaches decided limit
    }
    useEffect(() => {
        const handleRouteChangeComplete = async () => {



            if ((window.history.state && window.history.state.navigationDirection == "back") || wentBack)
                setServices(userServices.slice(0, userServices.length -1)); //goal is to remove current services from list of services that user selects
            if (wentBack){
                setBack(false);
                router.back(); //should be the services menu page since you can only reach this page by clicking a service in services menu
            }
        };

        const handleAdd = async () => {
            if (numberPlaces == userServices.length && !moreThan1)
                {
                    const addressArr = [];
                    userServices.forEach(element => {
                        addService(element.formattedAddress, element);
                        addressArr.push(element.formattedAddress);
                    });
                    await addHistoryService(addressArr, userEmail[1]);
                    setMoreThan1(true);
                }
            router.push("/end");
        }

        if (!addServices)
            handleRouteChangeComplete();
        else 
            handleAdd();

    }, [wentBack, addServices]
    );

    const handleGoogleMapsClick = () => {
        // get the current service (the last one in the array)
        const currentIndex = userServices.length - 1;
        console.log(currentIndex);
        const currentService = userServices[currentIndex];
        console.log(currentService);
        let originAddress, originLat, originLng;
        
        // check if there is a previous service to use as origin
        if (currentIndex > 0) {
            const previousService = userServices[currentIndex - 1];
            originAddress = previousService.formattedAddress;
            
            // get origin coordinates from previous service
            if (previousService.geometry && previousService.geometry.location) {
                originLat = previousService.geometry.location.lat;
                originLng = previousService.geometry.location.lng;
            } else if (previousService.location) {
                originLat = previousService.location.lat;
                originLng = previousService.location.lng;
            } else if (previousService.lat && previousService.lng) {
                originLat = previousService.lat;
                originLng = previousService.lng;
            } else {
                // default fallback coordinates
                originLat = 26.304225;
                originLng = -98.163751;
            }
        } else {
            // no previous service, so use default values
            originAddress = "Your Location";
            originLat = 26.304225;
            originLng = -98.163751;
        }
        
        // get destination coordinates - handle different possible structures
        let destLat, destLng;
        
        // check if the service has geometry.location structure
        if (currentService.geometry && currentService.geometry.location) {
            destLat = currentService.geometry.location.lat;
            destLng = currentService.geometry.location.lng;
        }
        // check if it has a location property
        else if (currentService.location) {
            destLat = currentService.location.lat;
            destLng = currentService.location.lng;
        }
            // Check if it has lat/lng at the root level
        else if (currentService.lat && currentService.lng) {
            destLat = currentService.lat;
            destLng = currentService.lng;
        }
        // fallback to default coordinates if we can't find them in the service object
        else {
            console.error("Could not find coors so using defaults");
            destLat = 26.3017;
            destLng = -98.1633;
        }
        
        // construct the url with query parameters
        const routeUrl = `/route?origin=${encodeURIComponent(originAddress)}&destination=${encodeURIComponent(currentService.formattedAddress)}&originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`;
        
        router.push(routeUrl);
    };

    return(
        <div className="full_page bg-secondary">
              <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&loading=async`}
                onLoad={() => setIsScriptLoaded(true)}
                strategy="afterInteractive"
            />
            <ServicePageHeading />
            <div className="container mt-5">
                <div className="row row-cols-2 service_info">
                    <div className="col-4 h-100">
                        <h1 className="fs-1 text-white">Map:</h1>
                        <div className="h-100 bg-secondary-subtle">
                            {userServices[userServices.length-1]?.formattedAddress ? (
                                <GenericSingleMap 
                                    address={userServices[userServices.length-1].formattedAddress}
                                    isLoaded={isScriptLoaded}
                                />
                            ):(<div className="text-center pt-3">Loading map...</div>)
                            }
                        </div>
                    </div>

                    <div className="col-8 h-100">
                        <h1 className="fs-1 text-white">Info:</h1>
                        {userServices.length > 0 && //to prevent errors when scenario that there are no services in list
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
                                        <button 
                                            onClick={handleGoogleMapsClick} 
                                            className="fs-3 btn btn-primary w-100 mt-4"
                                        >
                                            Google Maps
                                        </button>
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
