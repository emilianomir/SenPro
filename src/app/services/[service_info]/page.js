"use client"
import ServicePageHeading from "@/components/ServicePageHeading";
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
    const [isOpen, setIsOpen] = useState(false);
    const current_service = userServices[userServices.length-1]; 
    const router = useRouter();
    const [addServices, setYes] = useState(false)
    const [clickedPop, setClickedPop] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    if( userServices.length > 0){
        if(current_service.photoURL)
            current_service.photo_image = current_service.photoURL;
    }

    const handleSmallPopUP = ()=>{
        console.log("I RAN")
        if (isLargeScreen)
            return;
        if (!clickedPop) {
            setClickedPop(true)
            document.body.classList.remove('overflow-hidden')
        }
        else {
            setClickedPop(false)
            document.body.classList.add('overflow-hidden')
        }

    }  
            

    const handleBack = ()=>{
        setBack(true);
    }



    const handleToggle = ()=> {
        setOnlyFuel(!onlyFuel);
    }

    const goToGallery = async ()=>{ //we don't have to worry about checking to see if there are photos in object since the gallery overlay would only show up if there are more than four photos present
        setLoading(true);
        setIsOpen(true);
        if (current_service.photo_images_urls == undefined) { //this checks to see if we already made a call and have the photos stored in object
            const temp = []; 
            for (let i = 1; i < current_service.photos.length; i ++) { //we start at 1 since we already have cover photo
                const response = await fetch('/api/maps/places?thePhoto=' + current_service.photos[i].name); //need to make a get request for each photo that is not cover (max: 9)
                if (response.ok) {
                    const photoURL = response;
                    temp.push(photoURL.url);
                }
                    
                //await new Promise(resolve => setTimeout(resolve, 100)); //waits for 300 ms until next request (to avoid 429 error)
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

    useEffect(() => {
        const handleGalleryOpen = () =>{
            console.log("Gallery ran")
            if (isOpen) {
                document.body.classList.add('overflow-hidden');
            }
            else {
                document.body.classList.remove('overflow-hidden');
            }
        }
        handleGalleryOpen();
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen])

    useEffect(() => {
        const handleResize = () => {
          console.log("resize ran")
          const mdBreakpoint = 1024; 
          setIsLargeScreen((window.innerWidth >= mdBreakpoint));
          document.body.classList.add('overflow-hidden');
        };
    
        // Add event listener on mount
        window.addEventListener("resize", handleResize);
        handleResize(); // Check immediately on mount
    
        // Clean up event listener
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    



    return(
        <div className="h-screen">
              {/* <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&loading=async`}
                onLoad={() => setIsScriptLoaded(true)}
                strategy="afterInteractive"
            /> */}
            <ServicePageHeading />
            {current_service && 
            <div className="h-full md:grid md:grid-cols-7 relative">
                <div className={`md:col-span-4 bg-white text-black ${clickedPop ? "hidden" : "visible h-7/10"} md:h-full`}>
                    <h1>Map Placeholder</h1>
                </div>
                <div onClick={()=> (!clickedPop && handleSmallPopUP())} className={`md:col-span-3 my-3 mx-3 rounded-lg bg-gray-800/80 ${isLargeScreen ? "h-[84vh]" : "h-[135vh"}`}>
                    {clickedPop && 
                        <div className="absolute text-center top-0 flex w-full h-1/10 justify-center left-0">
                            <div onClick={handleSmallPopUP} className="h-full w-19/20">
                            </div>
                        </div>}
                    <h1 className="text-3xl text-center pt-4 font-extrabold underline">{current_service.displayName.text}</h1>
                    {onlyFuel ? 
                    <div className="h-1/2 w-full flex justify-center mt-4 ">   
                        <table className= "h-full w-9/10 border-spacing-2 ">
                            <thead className="text-xl md:text-2xl">
                                <tr>
                                <th className="">Gas Type</th>
                                <th className="">Current Price</th>
                                </tr>
                            </thead>
                            <tbody className=" text-center bg-slate-700/80 text-lg md:text-xl">
                                {current_service.fuelOptions.fuelPrices.map((item)=> (
                                    <tr key = {item.type} className="border-separate">
                                        <td className="border border-gray-300">{item.type}</td>
                                        <td className="border border-gray-300">{item.price.currencyCode == "USD" && "$"} {Number(item.price.units)  + (item.price.nanos/1000000000)} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-1 mt-4 h-3/4 md:h-1/2 mx-2">
                        <div className={`${!isLargeScreen && "h-[25vh]" } relative md:group`}>
                            <Image className = "rounded-lg object-cover object-center" src= {!current_service.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": current_service.photo_image} fill alt = "Service image" unoptimized = {true} />

                            {(current_service.photos.length > 5) &&
                                <div onClick={goToGallery } className= {`h-full w-full md:opacity-0 md:group-hover:opacity-100 bg-gray-500/35 absolute top-0 z-2 transition-opacity duration-300 flex justify-center items-center text-gray-100 text-4xl font-bold`}>Gallery</div>}
                        </div>
                        <div className="mt-4 px-3">
                            <div className="bg-gray-700 rounded-lg py-1 text-gray-100">
                                {current_service.regularOpeningHours?.weekdayDescriptions &&
                                <div className="text-center mt-3 px-2">
                                    <div className="font-bold text-base md:text-2xl">Weekly Operations:</div>
                                    {current_service.regularOpeningHours.weekdayDescriptions.map((desc, index)=>
                                        <div key = {desc} className="text-sm md:text-md pb-1">{desc}</div>
                                    )}
                                </div>
                                }     
                            </div>

                        </div>

                    </div>
                    }
                    <div className="mt-3 pl-6 text-xl md:text-2xl font-bold"> <b>Address:</b> {current_service.formattedAddress}</div>
                    {current_service.fuelOptions ?
                    
                        <div className="grid md:grid-cols-5 gap-1 mt-4">
                            {current_service.websiteUri != undefined &&
                            <div className=" md:col-span-3 flex w-full justify-center items-center">
                                <div className="px-3 text-xl">Visit their website here:
                                    <span>
                                    <a href={current_service.websiteUri} target="_blank" rel="noopener">
                                        <div className="p-2 px-4 border-2 border-gray-200 inline ml-3">Website</div>
                                    </a>
                                    </span> 
                                </div>
                            </div>
                            }
                            <div className="flex h-full w-full md:justify-center md:items-center md:col-span-2">
                                <div className="border border-2 text-xl p-2 text-center" onClick={handleToggle}>
                                    {onlyFuel ? "Info": "Current Gas Prices"}
                                </div> 
                            </div>
                        </div>
                    :
                    current_service.websiteUri != undefined &&
                        <div className="mt-4">
                            <div className="px-3 text-lg md:text-xl">Visit their website here:
                                <span>
                                <a href={current_service.websiteUri} target="_blank" rel="noopener">
                                    <div className="p-2 px-4 border-2 border-gray-200 inline ml-3">Website</div>
                                </a>
                                </span> 
                            </div>
                        </div>
                        

                    }   

     

                    <div className="w-full flex justify-center">
                        <div className="grid grid-cols-2 gap-4 text-2xl md:text-3xl mt-7 w-3/4 text-center">
                            <div onClick={handleBack} className="border-2 border-gray-200 p-2">
                                Back
                            </div>
                            <div onClick={handleEnter} className="border-2 border-gray-200 p-2">
                                {numberPlaces == userServices.length ? "Finish": "Next"}
                            </div>  
                        </div>
                    </div>



                </div>
                <div className={`${isOpen ? "opacity-100 z-2" : "opacity-0 -z-2"} ease-out duration-300 fixed inset-0 flex items-center justify-center bg-black/50`}>
                    <div className={`${isOpen ? "opacity-100": "opacity-0"} transition-opacity ease-in-out duration-500 bg-white p-6 rounded-lg shadow-lg h-9/10 md:h-5/6  md:w-5/6`}>
                        <h2 className="text-3xl font-bold text-black">Gallery:</h2>
                        <div className="h-4/5">
                            {loading ? 
                            <div className="text-black">Loading</div>
                            :
                            
                            <div className="overflow-y-auto h-full grid grid-cols-1 md:grid-cols-5 gap-2">
                                <div className="h-1/2">
                                    <Service_Image url ={current_service.photo_image} />
                                </div>
                                {current_service.photo_images_urls && current_service.photo_images_urls.map(image => 
                                <div className="h-1/2" key = {image}> 
                                    <Service_Image url={image} />
                                </div>
                                )}
                                
                            </div>
                            }
                            
                        </div>
                        <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsOpen(false)}
                        >
                        Close
                        </button>
                    </div>
                </div>
            </div>
    }
           
            
        </div>
    );
}
