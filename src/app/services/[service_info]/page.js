"use client"
import ServicePageHeading from "@/components/ServicePageHeading";
import { useAppContext } from "@/context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { addService, addHistoryService } from '@/components/DBactions';
import Loading from "@/components/Loading";
import Service_Image from "@/components/Service_Image";
import TravelMode from "@/components/TravelMode";




export default function ServiceInfo(){
    const {userServices, setServices, numberPlaces, userResponses, userEmail, userAddress, guestAddress} = useAppContext();
    const [wentBack, setBack] = useState(false); //used to check when the user leaves page in regards to our UI, not back arrow from browser 
    const [loading, setLoading] = useState(false);
    const [moreThan1, setMoreThan1] = useState(false);
    const [onlyFuel, setOnlyFuel] = useState(false); //used for fuel toggle
    const [isOpen, setIsOpen] = useState(false);
    const current_service = userServices[userServices.length-1];
    const prevService = userServices.length > 1 ? userServices[userServices.length-2] : null; // check if there is a previous service, used for the travelmode.js component
    if (!userEmail)
        redirect("/login")
    const originAddressToUse = prevService ? prevService.formattedAddress : (guestAddress? guestAddress[0] : userAddress[0]); // if there is a previous service, use the previous service's address as the origin, otherwise use the user's address or guest address
    const router = useRouter();
    const [addServices, setYes] = useState(false)
    const [clickedPop, setClickedPop] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [theme, setTheme] = useState(null)
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
            await Promise.all([
                current_service.photos.map(async (thePhoto, i) => {
                    if (i > 0){
                        const response = await fetch('/api/maps/places?thePhoto=' + thePhoto.name); //need to make a get request for each photo that is not cover (max: 9)
                        if (response.ok) {
                            const photoURL = response;
                            temp.push(photoURL.url);
                        }
                    }
                })
            ])
            await new Promise(resolve => setTimeout(resolve, 800)); //waits for 300 ms until next request (to avoid 429 error)
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
            if (numberPlaces == userServices.length && !moreThan1 && userEmail && userEmail[0] != 'guest')
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
        const handleTheme = () => {
            const htmlElement = document.documentElement;

            if (htmlElement.classList.contains('dark')) {
              setTheme("Dark")
            } else if (htmlElement.classList.contains('light')) {
              setTheme("Light")
            } 
        }

        const handleResize = () => {
          console.log("resize ran")
          const mdBreakpoint = 1024; 
          setIsLargeScreen((window.innerWidth >= mdBreakpoint));
          document.body.classList.add('overflow-hidden');
        };
        window.addEventListener("resize", handleResize);
        handleResize(); 
        handleTheme();
        // Clean up event listener
        return () => window.removeEventListener("resize", handleResize);
      }, []);





    return(
        <div className="h-screen ">
            <ServicePageHeading />
            {current_service && 
            <div className="h-full md:grid md:grid-cols-7 relative bg-land-sec-bg/50 ">
                <div className={`md:col-span-4 text-black ${clickedPop ? "hidden" : "visible h-7/10"} md:h-full overflow-y-auto`}>
                    <TravelMode
                        originAddress={originAddressToUse}
                        destinationAddress={current_service.formattedAddress}
                    />
                </div>
                <div onClick={()=> (!clickedPop && handleSmallPopUP())} className={`md:col-span-3 my-3 mx-3 rounded-lg bg-content-back border-2 border-outline ${isLargeScreen ? "h-[84vh]" : "h-[135vh"}`}>
                    {clickedPop && 
                        <div className="absolute text-center top-0 flex w-full h-1/10 justify-center left-0">
                            <div onClick={handleSmallPopUP} className="h-full w-19/20">
                            </div>
                        </div>}
                    <h1 className="text-3xl text-center pt-4 font-extrabold underline text-textscheme">{current_service.displayName.text}</h1>
                    {onlyFuel ? 
                    <div className="h-1/2 w-full flex justify-center mt-4 ">   
                        <table className= "h-full w-9/10 border-spacing-2">
                            <thead className="text-xl md:text-2xl text-content-text font-bold">
                                <tr>
                                <th className="">Gas Type</th>
                                <th className="">Current Price</th>
                                </tr>
                            </thead>
                            <tbody className=" text-center bg-land-card text-lg md:text-xl">
                                {current_service?.fuelOptions?.fuelPrices?.map((item)=> (
                                    <tr key = {item.type} className="border-separate border-ind-border border-1 text-base  md:text-lg">
                                        <td className="text-content-text/90 font-semibold py-2 px-2">{item.type}</td>
                                        <td className="text-content-text/80  ">{item.price.currencyCode == "USD" && "$"} {Number(item.price.units)  + (item.price.nanos? item.price.nanos/1000000000: 0)} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-1 mt-4 h-3/4 md:h-1/2 mx-2">
                        <div className={`${!isLargeScreen && "h-[25vh]" } relative group`}>
                            <Image className = "rounded-lg object-cover object-center" src= {!current_service.photo_image? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": current_service.photo_image} fill alt = "Service image" unoptimized = {true} />

                            {(current_service && current_service.photos?.length > 5) &&
                                <div onClick={goToGallery } className= {`h-full w-full md:opacity-0 md:group-hover:opacity-100 bg-gray-500/35 absolute top-0 z-10 transition-opacity duration-300 flex justify-center items-center text-gray-100 text-4xl font-bold`}>Gallery</div>}
                        </div>
                        <div className="mt-4 px-3">
                            <div className={`bg-land-card ${theme == "Light" && "border-2 border-outline shadow-md"} rounded-lg py-1 text-content-text`}>
                                {current_service.regularOpeningHours?.weekdayDescriptions ?
                                <div className="text-center mt-3 px-2">
                                    <div className="font-bold text-base md:text-2xl">Weekly Operations:</div>
                                    {current_service.regularOpeningHours.weekdayDescriptions.map(desc=>
                                        <div key = {desc} className="text-sm md:text-md pb-1">{desc}</div>
                                    )}
                                </div>
                                :
                                <div className="w-full h-full flex justify-center items-center text-2xl">
                                    No Hours Available
                                </div>
                                }     
                            </div>

                        </div>

                    </div>
                    }
                    <div className="mt-3 pl-6 text-xl md:text-2xl font-bold text-content-text"> Address: {current_service.formattedAddress}</div>
                    {current_service.fuelOptions ?
                    
                        <div className="grid md:grid-cols-5 gap-1 mt-4 text-content-text">
                            {current_service.websiteUri != undefined &&
                            <div className=" md:col-span-3 flex w-full justify-center items-center">
                                <div className="px-3 text-xl">Visit their website here:
                                    <span>
                                    <a href={current_service.websiteUri} target="_blank" rel="noopener">
                                        <div className="p-2 px-4 inline bg-land-card hover:bg-ind-hover-btn text-content-text/80 border-ind-border border-1 p-2 rounded-lg">Website</div>
                                    </a>
                                    </span> 
                                </div>
                            </div>
                            }
                            <div className="flex h-full w-full md:justify-center md:items-center md:col-span-2">
                                <div className="p-2 px-4 inline bg-land-card hover:bg-ind-hover-btn text-content-text/80 border-ind-border border-1 p-2 rounded-lg cursor-pointer" onClick={handleToggle}>
                                    {onlyFuel ? "Info": "Current Gas Prices"}
                                </div> 
                            </div>
                        </div>
                    :
                    current_service.websiteUri != undefined &&
                        <div className="mt-4 text-content-text">
                            <div className="px-3 text-lg md:text-xl">Visit their website: 
                                <span>
                                <a href={current_service.websiteUri} target="_blank" rel="noopener">
                                    <div className= "p-2 px-4 inline bg-land-card hover:bg-ind-hover-btn text-content-text/80 border-ind-border border-1 p-2 rounded-lg">Website</div>
                                </a>
                                </span> 
                            </div>
                        </div>
                        

                    }   

     

                    <div className="w-full flex justify-center">
                        <div className="grid grid-cols-2 gap-4 text-2xl md:text-3xl mt-7 w-3/4 text-center text-content-text">
                            <div onClick={handleBack} className="cursor-pointer bg-land-card hover:bg-ind-hover-btn text-content-text/80 border-ind-border border-1 p-2 rounded-lg">
                                Back
                            </div>
                            <div onClick={handleEnter} className="cursor-pointer bg-land-card hover:bg-ind-hover-btn text-content-text/80 border-ind-border border-1 p-2 rounded-lg">
                                {numberPlaces == userServices.length ? "Finish": "Next"}
                            </div>  
                        </div>
                    </div>



                </div>
                <div className={`${isOpen ? "opacity-100 z-10" : "opacity-0 -z-10"} ease-out duration-300 fixed inset-0 flex items-center justify-center bg-black/50`}>
                    <div className={`${isOpen ? "opacity-100": "opacity-0"} transition-opacity ease-in-out duration-500 bg-land-card p-6 rounded-lg shadow-lg h-9/10 md:h-5/6  md:w-5/6 border-ind-border border-1`}>
                        <h2 className="text-3xl font-bold text-content-text pb-3">Gallery:</h2>
                        <div className="h-4/5">
                            {loading ? 
                            <div className="text-content-text">Loading...</div>
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
