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
import Loading from "@/components/Loading";
import { Modal } from 'bootstrap';
import Service_Image from "@/components/Service_Image";




export default function ServiceInfo(){
    const {userServices, setServices, numberPlaces, userResponses} = useAppContext();
    const [wentBack, setBack] = useState(false); //used to check when the user leaves page in regards to our UI, not back arrow from browser 
    const [loading, setLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [onlyFuel, setOnlyFuel] = useState(false);
    const current_service = userServices[userServices.length-1];
    const router = useRouter();

    const handleBack = ()=>{
        setBack(true);
    }

    const handleToggle = ()=> {
        setOnlyFuel(!onlyFuel);
    }

    const goToGallery = async ()=>{ //we don't have to worry about checking to see if there are photos in object since the gallery overlay would only show up if there are more than four photos present
        setLoading(true);
        if (current_service.photo_images_urls == undefined) { //this checks to see if we already made a call and have the photos stored in object
            const temp = []; 
            for (let i = 1; i < current_service.photos.length; i ++) { //we start at 1 since we already have cover photo
                const response = await fetch('/api/maps/places?thePhoto=' + current_service.photos[i].name); //need to make a get request for each photo that is not cover (max: 9)
                if (response.ok) {
                    const {photoURL} = await response.json();
                    temp.push(photoURL);
                }
                    
                await new Promise(resolve => setTimeout(resolve, 300)); //waits for 300 ms until next request (to avoid 429 error)
            }
        current_service.photo_images_urls = temp; //this holds the array of photos url
        setLoading(false);
    }
        else { //this means we already have photos stored
            setLoading(false);
        }
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
            {current_service && 
            <div className="container mt-5">
                <div className="row row-cols-2 service_info">
                    <div className="col-4 h-100">
                        <h1 className="fs-1 text-white">Map:</h1>
                        <div className="h-100 bg-secondary-subtle">
                            <div className="bg-white map_place text-center">
                                Map Placeholder
                            </div>
                            {/* {current_service?.formattedAddress ? (
                                <GenericSingleMap 
                                    address={current_service.formattedAddress}
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
                        <div className="bg-secondary-subtle h-100 position-relative">
                        {current_service.fuelOptions && <button className="position-absolute fs-4 top-0 end-0 btn btn-primary mt-4 me-3" onClick={handleToggle}>{onlyFuel ? "Info": "Gas Prices"}</button>}
                        
                        <div className="fs-2 text-center pt-3 fw-bolder">{current_service.displayName.text}</div>

                        {onlyFuel ? 
                            <div className="container">
                                <h1 className="text-center fw-bolder mt-4 mb-4">Fuel Prices of {current_service.displayName.text}</h1>
                                <div className="row row-cols-2 justify-content-md-center">
                                    {current_service.fuelOptions.fuelPrices.map((item)=> (
                                        <div key = {item.type} className="bg-white text-center col-5 me-3 mb-3 rounded border border-1 border-dark">
                                            <div className="fs-4 fw-bold text-wrap">{item.type}</div>
                                            <div className="fs-4">Price:</div>
                                            <div className="fs-4 fw-bold">{item.price.currencyCode == "USD" && "$"} {Number(item.price.units)  + (item.price.nanos/1000000000)} </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            :

                            <div className="row row-cols-2">
                                <div className="col-5">
                                    <div className="position-relative bob">
                                        <Image className = "service_images w-100 ms-2 mt-4" src= {!current_service.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": current_service.photo_image} width={300} height={300} alt = "Service image" unoptimized = {true} />
                                        {(current_service.photo_image && current_service.photos.length > 4) && //this opens the modal and calls the api in the background
                                            <div onClick={goToGallery} data-bs-toggle = "modal" data-bs-target = "#galleryModal" className="overlay">
                                                <div className="ms-2 position-absolute top-0 start-0 w-100 h-100 bg-secondary-subtle opacity-50"></div>
                                                <div className="position-absolute top-50 start-50 translate-middle fs-3 fw-bold">Gallery</div>
                                            </div>
                                        }
                                    </div>
                                    {current_service.websiteUri != undefined &&
                                        <div className="ms-2 w-100 text-center">
                                            <a href={current_service.websiteUri} target="_blank" rel="noopener">
                                            <button className="btn btn-primary w-100 fs-3">Website</button>
                                            </a>
                                        </div>}
                                    
                                </div>
                                <div className="col-7 row row-cols-1 mt-0">
                                    <div className="col text-center ps-3">
                                        {current_service.regularOpeningHours?.weekdayDescriptions &&
                                        <div className="text-center mt-3">
                                            <div className="fw-bold fs-3">Weekly Operations:</div>
                                            {current_service.regularOpeningHours.weekdayDescriptions.map((desc, index)=>
                                                <div key = {[index, desc]} className="fs-5">{desc}</div>
                                            )}
                                        </div>
                                        }

                                        <div className="text-center mt-2 fs-3"> <b>Address:</b> {current_service.formattedAddress}</div>
                
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
                    
                        }

  
                        </div> 
                        

                    </div>
                </div> 
            </div>
    }
            {current_service && 
            <div className="modal fade" id="galleryModal" tabIndex="-1">
                <div className="modal-dialog modal-xl">
                  <div className="modal-content bg-secondary">
                    <div className="modal-header w-100">
                      <h1 className="modal-title fs-2 fw-bold text-white w-100 text-center">Gallery</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                    </div>
                    <div className="modal-body">
                    {loading ? 
                        <Loading message={"Fetching additional images"} />
                        :
                        <div className="h-100">
                            <div className="row row-cols-5 p-2">
                                <div className="col p-2 bg-white">
                                    {/* this is the cover image */}
                                    <Service_Image url = {current_service.photo_image} /> 
                                </div>
                                {current_service.photo_images_urls && current_service.photo_images_urls.map((theUrl)=>(
                                    <div className="col bg-white p-2" key = {theUrl}>
                                        <Service_Image  url = {theUrl}/>
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                      }
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            }
            
        </div>
    );
}
