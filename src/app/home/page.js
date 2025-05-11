"use client"
import { useAppContext } from "@/context"
import { useRouter, redirect } from "next/navigation";
import Favorites_Section from "@/components/Favorites_Section";
import { useEffect, useState} from "react";
import { getUserSession, getCords, getPosts, getUser, createStatelessQ, deleteSession} from "@/components/DBactions";
import Home_Squares from "@/components/Home_Squares";
import Loading from "@/components/Loading";
import { useQRCode } from 'next-qrcode';

const info = [
    {heading: "Plan Trip", text: "Create a List of Services for Your Next Trip Plan", location:"/start"},
    {heading: "Past Trips", text: "View Your Past History of List of Services Created", location: "/history"}
]


export default function Begin(){
    const { Image } = useQRCode();
    const {userEmail, userAddress, setUserEmail, setUserAddress, reset, numberPlaces} = useAppContext();
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(false);
    const [back, setBack] = useState(false);
    const [openOverlay, setOverlay] = useState(null);
    const [cardInfo, setCardInfo ] = useState([])

    // Gets the session
    useEffect(() => {
      const fetchProducts = async () => {
        try{
            setLoading(true)
            let userName = await getUserSession();
            if(userName == null){
                setBack(true);
            }
            else {
                setUserEmail([userName[0].username, userName[0].email]);
                const cords = await getCords(userName[0].email);
                setUserAddress([userName[0].address, {latitude: cords[0], longitude: cords[1]}]);
            }
            setPost(true);
          }
        
    
        catch(error) {
            console.error("Error fetching DB:", error);
            alert("There was an issue getting the data.");
        } finally {
          setLoading(false);
        }
        
      }

      const fullReset = async ()=> {
        reset();
        await deleteSession('Qsession');
        await createStatelessQ(0, [], null, null, userEmail[1]);
      }

      if(!userEmail)fetchProducts();
      else setPost(true);

      if (numberPlaces != 0) 
        fullReset()
}, []);

    useEffect(() => {
      const fetchPosts = async () => {
        try{
            setLoading(true)
            const values = await getPosts(userEmail[1]);
            console.log(values);
            setCardInfo(values);
            const user = await getUser(userEmail[1])
            const htmlElement = document.documentElement;
            htmlElement.classList.replace('light', user[0].theme)
          }
        
    
        catch(error) {
            console.error("Error fetching DB:", error);
            alert("There was an issue getting the data.");
        } finally {
          setLoading(false);
        }
        
      }
      if (post)
        fetchPosts();
    }, [post]);

    const getServices = async (index)=> {
        setOverlay(index);
        if (cardInfo[index].done)
            return;
        try {
            const googleMapURL = "https://www.google.com/maps/dir/";
            const addressURLS = [];
            const serviceArray = await Promise.all(
                cardInfo[index].services.map(async serviceId => {
                    const response = await fetch(`/api/maps/places?id=${serviceId}&basic=true`); 
                    const {service_result} = await response.json();
                    service_result.id = serviceId;
                    const dirAddress = service_result.formattedAddress.includes("#") ? service_result.formattedAddress.substr(0, service_result.formattedAddress.indexOf('#')): service_result.formattedAddress
                    addressURLS.push(dirAddress)
                    return service_result;
                })
            )
            const fullAddress = googleMapURL + userAddress[0] + "/" + addressURLS.join('/');
            console.log(serviceArray);
            console.log('NEW OBJECT: ')
            setCardInfo(obj => 
                [...obj.map((item, i)=> 
                    i === index ?
                    {...item, services: serviceArray, dir: fullAddress, done: true}:
                    item
                )]
            );

                
            } 
        catch(error){
            console.error("Error fetching DB:", error);
            alert("There was an issue getting data");
        }
    }

  

    if (back)
        redirect("/login");


    // if (userEmail == null)
    //     redirect("/login");
    return (
        <>
        {userEmail ?
        <div className="">
            <div className="w-full h-full flex justify-center">
                <div className="bg-land-sec-bg/20 w-full h-full pb-0 text-content-text">
                    <div className="h-1/8 bg-heading-bg text-center">
                        <h1 className="px-1 text-4xl md:text-5xl pt-6 font-bold text-white">Welcome {userEmail[0]}</h1>
                        <h2 className="text-2xl md:text-3xl mt-4 font-semibold text-white pb-2">What are you planning to do today?</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mx-4 mt-7">
                        <Home_Squares info={info[0]} />
                        <Home_Squares info ={info[1]} />
                    </div>
                    <div>
                        <div className=" text-center mt-10 text-3xl font-bold mb-3 py-3 mb-3">
                            Your Favorites Section:
                            <div className="mt-2 w-full flex justify-center">
                                <div className="w-4/5 bg-content-text/50 h-1"/>
                            </div>
                        </div>
                        <Favorites_Section />
                    </div>
                    <div>
                        <div className=" mt-10 mb-3 py-3">
                            <div className="text-center text-3xl font-bold">
                                Nearby Users Trip:
                            </div>
                            <div className="mt-2 w-full flex justify-center">
                                <div className="w-4/5 bg-content-text/50 h-1"/>
                            </div>
                            {cardInfo.length > 0 ?
                            <div className="flex w-full justify-center flex-row gap-2">
                                {cardInfo.map((information, index)=> (
                                    <div key = {index} className="w-1/4">
                                        <div onClick={()=>getServices(index)} className="w-full h-85 bg-land-card mt-3 ml-3 rounded-lg group cursor-pointer">
                                            <div className="h-2/3 flex w-full justify-center items-center bg-[url(https://img.freepik.com/free-vector/realistic-travel-background-with-elements_52683-77784.jpg?semt=ais_hybrid&w=740)] bg-cover">
                                            <div className="h-full opacity-0 transition-opacity ease-in-out duration-300 group-hover:opacity-100 bg-gray-200/40 w-full flex justify-center items-center">
                                                <div className="bg-gray-200/20 py-3 w-1/2 text-black text-2xl font-bold rounded-lg text-center">
                                                    Preview
                                                </div>
                                            </div>
                                            </div>
                                            <div className="h-1/3 flex bg-gray-300/50 rounded-b-lg group-hover:bg-gray-400/50">                        
                                                <div className="h-full flex flex-col pl-2">
                                                    <div className="font-bold text-xl text-left text-content-text h-1/2">
                                                        {information.header}
                                                    </div>
                                                    <div className="grid grid-cols-12 h-1/4">
                                                        <div className="col-span-2">
                                                            <img className = "w-10"  src = "/imgs/avatar-head.png"  alt = "profileIcon" /> 
                                                        </div>
                                                        <div className="flex items-center col-span-3">
                                                            <div className="text-content-text/70 text-lg">
                                                                {information.user}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center col-end-11">
                                                            <div>
                                                                <svg width="25" height="25" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                                                                                2 5.42 4.42 3 7.5 3 
                                                                                c1.74 0 3.41 0.81 4.5 2.09 
                                                                                C13.09 3.81 14.76 3 16.5 3 
                                                                                19.58 3 22 5.42 22 8.5 
                                                                                c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                                                </svg>
                                                            </div>
                                                            <div className="pl-2 inline">
                                                                {information.likes}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                ))}

                            </div>
                            :
                            <div className="w-full flex flex-col justify-center items-center mt-2">
                                <div>
                                    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    
                                    <circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="4" fill="white" />


                                    <circle cx="35" cy="40" r="5" fill="blue" />
                                    <circle cx="65" cy="40" r="5" fill="blue" />

                                    <path d="M35 70 Q50 55 65 70" stroke="blue" strokeWidth="4" fill="transparent" />
                                    </svg>
                                </div>
                                <div className="text-2xl text-content-text font-semibold">
                                    No Users Nearby
                                </div>
                            </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${openOverlay != null ? "opacity-100 pointer-events-auto" :  "pointer-events-none opacity-0"} ease-in-out transition duration-500 fixed inset-0 flex items-center justify-center bg-black/50`}>
                <div className={`${openOverlay != null ? "opacity-100": "opacity-0"} transition-opacity ease-in-out duration-300 bg-land-sec-bg p-6 rounded-lg shadow-lg w-5/6 h-4/5 relative`}>
                    <div className="text-content-text font-bold text-3xl">          
                        {openOverlay != null && cardInfo[openOverlay].header}
                    </div>

                    {(openOverlay!= null && cardInfo[openOverlay].done) && 
                    <>
                    <div className="w-full flex justify-end text-content-text text-xl mt-3">
                        Give this plan a like: 
                    <div>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                                        2 5.42 4.42 3 7.5 3 
                                        c1.74 0 3.41 0.81 4.5 2.09 
                                        C13.09 3.81 14.76 3 16.5 3 
                                        19.58 3 22 5.42 22 8.5 
                                        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    </div>
                    <div className="w-full flex flex-col justify-center">

                        <div className="mt-3 flex justify-center">
                            <Image
                            text={cardInfo[openOverlay].dir}
                            />
                        </div>
                        <div className="text-center text-xl px-3 mt-3 mb-5 text-content-text">Scan the QR Code above on your phone for Google Maps Link. Or Click <a className="text-blue-400 hover:underline" href={cardInfo[openOverlay].dir} target="_blank" rel="noopener">Here </a></div>
                    </div>
                    </> }
                    <div className="overflow-y-auto">
                    { openOverlay != null &&
                
                    (cardInfo[openOverlay].done ? 
                    cardInfo[openOverlay].services.map((service, index) => (
                        <div className="ml-4 w-9/10 h-1/3 max-sm:pt-3 mb-4" key = {service.id}>
                            <div className="w-full bg-history-card/80 rounded-xl h-4/5 shadow-lg">
                                <div className="grid grid-cols-3 max-sm:grid-rows-2 md:grid-cols-12 w-full h-full gap-2">
                                    <div className="row-span-2 md:col-span-1 text-content-text/75 bg-history-card-sec/85 text-2xl md:text-5xl flex justify-center items-center h-full rounded-l-lg">
                                        {index + 1}
                                    </div>
                                    <div className={`${service.displayName.text.length > 25 ? "col-span-2 md:col-span-7" : "col-span-2 md:col-span-6"} flex flex-col h-full justify-center pl-5`}>
                                        <div className="font-extrabold text-xl md:text-3xl text-content-text rounded-lg mb-2">
                                            {service.displayName.text}
                                        </div>
                                        <div className="text-content-text/70 font-semibold text-lg md:text-2xl">
                                            {service.formattedAddress}
                                        </div>
                                    </div>
                                    <div className="col-span-1 md:col-span-2 md:col-end-12 flex justify-center items-center w-full">
                                        <p className = "bg-blue-600 text-white text-center text-base md:text-2xl font-semibold px-2 py-1.5 rounded-sm ms-3 w-full"> 
                                            Rating: {service.rating ? service.rating : "N/A" }
                                                <svg className="w-4 h-4 text-yellow-300 inline mb-1 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                            </svg>
                                        </p> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    
                    :   
                    openOverlay != null &&<Loading message={"Getting information"} />)}
                    </div>
                    <button
                    className="bg-red-500 text-white px-4 py-2 rounded absolute top-0 right-0 mr-2 mt-2 cursor-pointer"
                    onClick={() => setOverlay(null)}
                    >
                    Close
                    </button>
                </div>
            </div>
        </div>
        :
        <Loading message= "Fetching Session"/>
        }
        </>

    )
}