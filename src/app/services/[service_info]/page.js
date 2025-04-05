"use client"
import ServicePageHeading from "@/components/ServicePageHeading";
import "../../css/services_page.css"
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { addService, addHistoryService } from '@/components/DBactions';
import GenericSingleMap from "@/components/GenericSingleMap";
import Script from "next/script";
import Loading from "@/components/Loading";
import Service_Image from "@/components/Service_Image";
import { users } from "@/db/schema/users";




export default function ServiceInfo(){
    const {userServices, setServices, numberPlaces, userResponses, userEmail} = useAppContext();
    const [wentBack, setBack] = useState(false); //used to check when the user leaves page in regards to our UI, not back arrow from browser 
    const [loading, setLoading] = useState(false);
    const [moreThan1, setMoreThan1] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [onlyFuel, setOnlyFuel] = useState(false); //used for fuel toggle
    const current_service = userServices[userServices.length-1]; 
    const router = useRouter();
    const [addServices, setYes] = useState(false)


    if( userServices.length > 0){
        if(current_service.photoURL)
            current_service.photo_image = current_service.photoURL;
    }

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
                    const photoURL = response;
                    temp.push(photoURL.url);
                }
                    
                await new Promise(resolve => setTimeout(resolve, 100)); //waits for 300 ms until next request (to avoid 429 error)
            }
        current_service.photo_images_urls = temp; //this holds the array of photos url
        setLoading(false);
    }
        else { //this means we already have photos stored
            setLoading(false);
        }
    }

    const handleEnter = ()=> { 
        if (numberPlaces == userServices.length)
            setYes(true);
        else
            router.push("/questionaire") //checks to see if user reaches decided limit
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

        const handleAdd = async () => {
            if (numberPlaces == userServices.length && !moreThan1 && userEmail)
                {
                    const addressArr = [];
                    userServices.forEach(element => {
                        //addService(element.id)
                        addService(element.id, JSON.stringify(userResponses));
                        addressArr.push(element.id);
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


    return(
        <div className="">
              {/* <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&loading=async`}
                onLoad={() => setIsScriptLoaded(true)}
                strategy="afterInteractive"
            /> */}
            <ServicePageHeading />
            {current_service && 
            <div className="grid grid-cols-7">
                <div className="col-span-4 bg-white text-black">
                    <h1>Map Placeholder</h1>
                </div>
                <div className="col-span-3 my-3 mx-3 rounded-lg bg-gray-800/80 h-[84vh]">
                    <h1 className="text-3xl text-center pt-4 font-extrabold underline">{current_service.displayName.text}</h1>
                    {onlyFuel ? 
                    <div className="h-1/2 w-full flex justify-center mt-4">   
                        <table className="border-collapse border border-gray-400 h-full w-9/10">
                            <thead className="bg-gray-500 text-2xl">
                                <tr>
                                <th className="border border-gray-300">Gas Type</th>
                                <th className="border border-gray-300">Current Price</th>
                                </tr>
                            </thead>
                            <tbody className=" text-center text-xl">
                                {current_service.fuelOptions.fuelPrices.map((item)=> (
                                    <tr key = {item.type} className="">
                                        <td className="border border-gray-300">{item.type}</td>
                                        <td className="border border-gray-300">{item.price.currencyCode == "USD" && "$"} {Number(item.price.units)  + (item.price.nanos/1000000000)} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className="grid grid-cols-2 gap-1 mt-4 h-1/2 mx-2">
                        <div className="h-full">
                            <Image className = "rounded-lg object-cover h-full object-center" src= {!current_service.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": current_service.photo_image} width={300} height={400} alt = "Service image" unoptimized = {true} />
                        </div>
                        <div className="mt-4 px-3">
                            <div className="bg-gray-700 rounded-lg py-3 text-gray-100">
                                {current_service.regularOpeningHours?.weekdayDescriptions &&
                                <div className="text-center mt-3">
                                    <div className="font-bold text-2xl">Weekly Operations:</div>
                                    {current_service.regularOpeningHours.weekdayDescriptions.map((desc, index)=>
                                        <div key = {desc} className="text-lg/8">{desc}</div>
                                    )}
                                </div>
                                }     
                            </div>

                        </div>

                    </div>
                    }
                    <div className="mt-3 pl-3 text-2xl font-bold"> <b>Address:</b> {current_service.formattedAddress}</div>
                    {current_service.fuelOptions ?
                    
                        <div className="grid grid-cols-5 gap-1 mt-4">
                            {current_service.websiteUri != undefined &&
                            <div className=" col-span-3 flex w-full justify-center items-center">
                                <div className="px-3 text-xl">Visit their website here:
                                    <span>
                                    <a href={current_service.websiteUri} target="_blank" rel="noopener">
                                        <div className="p-2 px-4 border-2 border-gray-200 inline ml-3">Website</div>
                                    </a>
                                    </span> 
                                </div>
                            </div>
                            }
                            <div className="flex h-full w-full justify-center items-center col-span-2">
                                <div className="border border-2 text-xl p-2 text-center" onClick={handleToggle}>
                                    {onlyFuel ? "Info": "Current Gas Prices"}
                                </div> 
                            </div>
                        </div>
                    :
                    current_service.websiteUri != undefined &&
                        <div className="mt-4">
                            <div className="px-3 text-xl">Visit their website here:
                                <span>
                                <a href={current_service.websiteUri} target="_blank" rel="noopener">
                                    <div className="p-2 px-4 border-2 border-gray-200 inline ml-3">Website</div>
                                </a>
                                </span> 
                            </div>
                        </div>
                        

                    }   

     

                    <div className="w-full flex justify-center">
                        <div className="grid grid-cols-2 gap-4 text-3xl mt-7 w-3/4 text-center">
                            <div onClick={handleBack} className="border-2 border-gray-200 p-2">
                                Back
                            </div>
                            <div onClick={handleEnter} className="border-2 border-gray-200 p-2">
                                Next
                            </div>  
                        </div>
                    </div>



                </div>
            </div>
            // <div className="container mt-5">
            //     <div className="row row-cols-2 service_info">
            //         <div className="col-4 h-100">
            //             <h1 className="fs-1 text-white">Map:</h1>
            //             <div className="h-100 bg-secondary-subtle">
            //                 <div className="bg-white map_place text-center">
            //                     Map Placeholder
            //                 </div>
            //                 {/* {current_service?.formattedAddress ? (
            //                     <GenericSingleMap 
            //                         address={current_service.formattedAddress}
            //                         isLoaded={isScriptLoaded}
            //                     />
            //                 ):(<div className="text-center pt-3">Loading map...</div>)
            //                 } */}
            //                 <div className="">
            //                     <button className="fs-3 btn btn-primary w-100">Google Maps</button>
            //                 </div>
            //             </div>

            //         </div>

            //         <div className="col-8 h-100">
            //             <h1 className="fs-1 text-white">Info:</h1>
            //             <div className="bg-secondary-subtle h-100 position-relative">
            //             {current_service.fuelOptions && <button className="position-absolute fs-4 top-0 end-0 btn btn-primary mt-4 me-3" onClick={handleToggle}>{onlyFuel ? "Info": "Gas Prices"}</button>}
                        
            //             <div className="fs-2 text-center pt-3 fw-bolder">{current_service.displayName.text}</div>

            //             {onlyFuel ? 
            //                 <div className="container">
            //                     <h1 className="text-center fw-bolder mt-4 mb-4">Fuel Prices of {current_service.displayName.text}</h1>
            //                     <div className="row row-cols-2 justify-content-md-center">
            //                         {current_service.fuelOptions.fuelPrices.map((item)=> (
            //                             <div key = {item.type} className="bg-white text-center col-5 me-3 mb-3 rounded border border-1 border-dark">
            //                                 <div className="fs-4 fw-bold text-wrap">{item.type}</div>
            //                                 <div className="fs-4">Price:</div>
            //                                 <div className="fs-4 fw-bold">{item.price.currencyCode == "USD" && "$"} {Number(item.price.units)  + (item.price.nanos/1000000000)} </div>
            //                             </div>
            //                         ))}
            //                     </div>
            //                 </div>

            //                 :

            //                 <div className="row row-cols-2">
            //                     <div className="col-5">
            //                         <div className="position-relative gallery">
            //                             <Image className = "service_images w-100 ms-2 mt-4" src= {!current_service.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": current_service.photo_image} width={300} height={300} alt = "Service image" unoptimized = {true} />
            //                             {(current_service.photo_image && current_service.photos.length > 4) && //this opens the modal and calls the api in the background
            //                                 // <div onClick={goToGallery} data-bs-toggle = "modal" data-bs-target = "#galleryModal" className="overlay">
            //                                 <div className="overlay">
            //                                     <div className="ms-2 position-absolute top-0 start-0 w-100 h-100 bg-secondary-subtle opacity-50"></div>
            //                                     <div className="position-absolute top-50 start-50 translate-middle fs-3 fw-bold">Gallery</div>
            //                                 </div>
            //                             }
            //                         </div>
                                    // {current_service.websiteUri != undefined &&
                                    //     <div className="ms-2 w-100 text-center">
                                    //         <a href={current_service.websiteUri} target="_blank" rel="noopener">
                                    //         <button className="btn btn-primary w-100 fs-3">Website</button>
                                    //         </a>
                                    //     </div>}
                                    
            //                     </div>
            //                     <div className="col-7 row row-cols-1 mt-0">
                                    // <div className="col text-center ps-3">
                                    //     {current_service.regularOpeningHours?.weekdayDescriptions &&
                                    //     <div className="text-center mt-3">
                                    //         <div className="fw-bold fs-3">Weekly Operations:</div>
                                    //         {current_service.regularOpeningHours.weekdayDescriptions.map((desc, index)=>
                                    //             <div key = {[index, desc]} className="fs-5">{desc}</div>
                                    //         )}
                                    //     </div>
                                    //     }

                                    //     <div className="text-center mt-2 fs-3"> <b>Address:</b> {current_service.formattedAddress}</div>
                
                                    // </div>
            //                         <div className="col text-center row row-cols-2 p-0 ps-4 mt-2">  
            //                             <div className="col text-center h-100" >
            //                                 <button onClick={handleBack} className="fs-3 btn btn-primary w-100 h-100">Back</button>
            //                             </div>
            //                             <div className="col h-100">
            //                                 <button onClick={handleEnter} className="fs-3 btn btn-primary w-100 h-100">Next</button>
            //                             </div>
            //                         </div>

            //                     </div>
            //                 </div>

                    
            //             }
            //             {/* {current_service.attributes &&     
            //             <p className="fs-6 text-wrap">Info by: <a href= {current_service.attributes.providerUri}> {current_service.attributes.provider} </a> </p> }
            //             {current_service.photos && current_service.photos[0].authorAttributions[0] &&     
            //             <p className="fs-6 text-wrap">Image By: <a href= {current_service.photos[0].authorAttributions[0].uri}> {current_service.photos[0].authorAttributions[0].displayName} </a> </p> } */}

            //             </div> 
                        

            //         </div>
            //     </div> 
            // </div>
    }
           
            
        </div>
    );
}
