"use client"
import ServiceCard from "@/components/ServiceCard";
import ServicePageHeading from "@/components/ServicePageHeading";
import { useAppContext } from "@/context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getUserSession, createStatelessQ, getInfoSession, deleteSession } from '@/components/DBactions';
import Link from "next/link";
import Favorites from "@/components/Favorites";



export default function Services(){
    const {userResponses, userServices, apiServices, guestAddress, setAPIServices, userEmail, setUserEmail, favorites, setFavorites, setServices, setResponses, numberPlaces, setNumberPlaces} = useAppContext(); //apiServices holds a copy of the services in case the user goes back and returns to page. Also used to avoid extra API calls
    const [clickedService, setClicked] = useState(false); //loading purposes
    const [sort, setSort] = useState(4); //0: distance, 1: rating, 2: userRating count, 3: priceRange (only food)
    const [asc, setAsc] = useState(true);
    const [hideDrop, setDrop] = useState(true);
    const [sortValue, setSortValue] = useState("Options");
    const [currentServices, setCurrentServices] = useState(apiServices);
    const [yes, setyes] = useState(true);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    console.log("Ran")

    const getMoreInfo = async (id) =>{
        const desired_service = apiServices.find(obj => obj.id === id);
        if (!desired_service.hasFullInfo) {
            setClicked(true);
            try {
                const response = await fetch(`/api/maps/places?id=` + desired_service.id + "&partial=true");
                if (response.ok) {
                    const {service_result} = await response.json();
                    for (const [key, value] of Object.entries(service_result)){
                        desired_service[key] = value;
                    desired_service.hasFullInfo = true;
                    }
                }
            }catch(error) {
                console.error("Error fetching service " + desired_service.id + ":", error);
            }


        }
        userServices.push(desired_service);
        router.push("/services/" + desired_service.displayName.text);
    }

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //     if (yes){
    //         try{
    //         setyes(false);
    //         let userName = await getUserSession();
    //         if (userName != null) setUserEmail([userName[0].username, userName[0].email]);

    //         let sessionValues = await getInfoSession();
    //         if(sessionValues == null || numberPlaces > 0)
    //             {
                    
    //                 if(numberPlaces > 0 && sessionValues != null) await deleteSession('Qsession');
    //                 let email = "HASHTHIS";
    //                 if(userName)
    //                 {
    //                     email = userName[0].email;
    //                 }
    //                 let userR = "";
    //                 if (userResponses){
    //                     let fuel_type = userResponses.fuel_type;
    //                     let main_category = userResponses.main_category;
    //                     let name = userResponses.name;
    //                     let priceLevel = userResponses.priceLevel;
    //                     let rating = userResponses.rating;
    //                     let textQuery = userResponses.textQuery;
    //                     let types = userResponses.types;
    //                     userR = { fuel_type,main_category,name,priceLevel,rating,textQuery,types };
    //                 }
    //                 await createStatelessQ(numberPlaces, favorites, userServices, apiServices, userR, email);
    //             }
    //             else
    //             {
    //                 setNumberPlaces(sessionValues.numberPlaces);
    //                 setFavorites(sessionValues.favorites);
    //                 setServices(sessionValues.userServices);
    //                 setResponses(sessionValues.userResponses);
    //                 setAPIServices(sessionValues.apiServices);
    //             }
    //     } catch(error) {
    //         console.error("Error fetching DB:", error);
    //         alert("There was an issue getting the data.");
    //     } finally {
    //         setLoading(false);
    //         }
    //     }
    //     }
    //     fetchProducts();
    // }, [yes]);

    const referencePoint = guestAddress ? [guestAddress[1].latitude, guestAddress[1].longitude] : [31.0000, -100.0000]; //need to use external api to convert location of user to lat and long
    console.log(guestAddress);
    console.log(referencePoint);
    const distanceCalculate = (la1, lo1, la2, lo2) => {  //uses the Haversine Formula
        if (asc){
            la1 = la1 ? la1 : 999
            lo1 = lo1 ? lo1 : 999
            la2 = la2 ? la2 : 999
            lo2 = lo2 ? lo2 : 999
        }
        else {
            la1 = la1 ? la1 : -999
            lo1 = lo1 ? lo1 : -999
            la2 = la2 ? la2 : -999
            lo2 = lo2 ? lo2 : -999
        }
        const earthR = 3959; //Miles
        const convertRadius = angle => angle * Math.PI / 180;
        const lat1Radius = convertRadius(la1);
        const lat2Radius = convertRadius(la2);
        const innerEquation = Math.sin((lat2Radius-lat1Radius)/2)**2 +
                              Math.cos(lat1Radius) * Math.cos(lat2Radius) * (Math.sin(convertRadius(lo2-lo1)/2) ** 2);
        const fullEquation = 2 * earthR * Math.asin(Math.sqrt(innerEquation));
        
        return fullEquation;

    }

    useEffect(()=> {
        const getMiles = () => {
            setCurrentServices(currentServices.map(obj => ({...obj, miles : (Math.round(distanceCalculate(referencePoint[0], referencePoint[1], obj.location?.latitude, obj.location?.longitude) * 100))/100})));
        }    
        getMiles();
    }, []);



    const theSort = (array, property) => {
        return [...array].sort((a,b) => a[property] ? b[property] ? asc ? a[property]- b[property]: b[property] - a[property] : a[property]- 0: 0 - b[property]? b[property]: 0)
    }
    
    useEffect(() => {
        const dropdownSet = () => {
            switch(sort) {
                case 0:
                    setCurrentServices(theSort(currentServices, "miles"));
                    // if (asc){
                    //     //dummyArray = dummyArray.sort((a,b) => distanceCalculate(referencePoint[0], referencePoint[1], a.lat, a.long) -  distanceCalculate(referencePoint[0], referencePoint[1], b.lat, b.long));
                    //     setCurrentServices(currentServices.sort((a,b) => distanceCalculate(referencePoint[0], referencePoint[1], a?.location?.latitude, a?.location?.longitude ) -  distanceCalculate(referencePoint[0], referencePoint[1], b?.location?.latitude, b?.location?.longitude)));
                    // }
                    // else {
                    //     console.log("I ran des");
                    //     setCurrentServices(currentServices.sort((a,b) => distanceCalculate(referencePoint[0], referencePoint[1], b?.location?.latitude, b?.location?.longitude) - distanceCalculate(referencePoint[0], referencePoint[1], a?.location?.latitude, a?.location?.longitude)));    
                    // }
                    setSortValue("Distance")
                    break;
                case 1:
                    setCurrentServices(theSort(currentServices, "rating"));
                    setSortValue("Rating")
                    break;
                case 2:
                    setCurrentServices(theSort(currentServices, "userRatingCount"));
                    setSortValue("Rating Count")
                    break;
                case 3:
                    console.log(currentServices.some(obj=> obj.fuelOptions));
                    if (currentServices.some(obj => obj.fuelOptions)){
                        setCurrentServices([...currentServices].sort((a,b) => {
                            let userReqFuel1 = a.fuelOptions?.fuelPrices?.find(obj => obj.type === userResponses.fuel_type);
                            let userReqFuel2 = b.fuelOptions?.fuelPrices?.find(obj => obj.type === userResponses.fuel_type);
                            console.log(userReqFuel1);
                            let price1 = userReqFuel1 ? Number(userReqFuel1.price.units) + (userReqFuel1.price.nanos ? userReqFuel1.price.nanos/1000000000: 0) : asc ? 10000000000000: 0;
                            let price2 = userReqFuel2 ? Number(userReqFuel2.price.units) + (userReqFuel2.price.nanos ? userReqFuel2.price.nanos/1000000000: 0) : asc ? 10000000000000: 0;
                            return asc ? price1 - price2 : price2 - price1; 
                        }))
                        setSortValue("Price")
                    }
                    else if (userResponses.main_category == "Food and Drink"){
                        setCurrentServices([...currentServices].sort((a,b)=> {
                            let hasPrice1 = asc ? a.priceRange?.startPrice?.units : a.priceRange?.endPrice? a.priceRange.endPrice.units: a.priceRange?.startPrice?.units;
                            let hasPrice2 = asc ? b.priceRange?.startPrice?.units : b.priceRange?.endPrice? b.priceRange.endPrice.units: b.priceRange?.startPrice?.units;
                            hasPrice1 = hasPrice1 ? Number(hasPrice1) : asc ? 10000000: 0;
                            hasPrice2 = hasPrice2 ? Number(hasPrice2): asc ? 10000000: 0;
                            return asc ? hasPrice1 - hasPrice2 : hasPrice2 - hasPrice1;
                        }))
                    }
                    break;
                default:
                    break;
            }
        }
        if (sort < 4)
            dropdownSet();
        console.log("RAn")
        

    },[sort, asc] );

    // if(loading){
    //     return (<Loading message= "Fetching Session"/>)
    // }
    return (
        <div className="">
            <ServicePageHeading />
                <div className="">
                    <div className="w-full flex justify-end">
                        {currentServices && <div className="text-2xl flex mr-20 mt-3">
                            <div className="mr-1">
                                Sort By: 
                            </div>
                            <div className="">
                                <div className="relative lg:ml-2">
                                    <button type="button" className ={`w-50 p-1 text-black bg-white ${!hideDrop ? "rounded-t-lg": "rounded-lg" } text-lg`} onClick={()=>setDrop(!hideDrop)}>
                                    {sortValue}
                                    </button>
                                    
                                    <div className={`${hideDrop? "opacity-0 -z-2": "opacity-100 z-2"} transition-opacity ease-out duration-250 absolute w-50 bg-white text-center text-black rounded-b shadow text-lg py-2`} id = "dropdown">
                                    <ul aria-labelledby = "dropdown">
                                        <li className={` ${sort == 0 ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 py-1`} onClick={()=>setSort(0)}>
                                            Distance
                                        </li>
                                        <li className={` ${sort == 1 ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 py-1`} onClick={()=>setSort(1)}>
                                            Rating
                                        </li>
                                        <li className={` ${sort == 2 ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 py-1`} onClick={()=>setSort(2)}>
                                            Rating Count
                                        </li>
                                        
                                        {(userResponses.main_category == "Food and Drink" || currentServices.some(theService => theService.fuelOptions)) && <li className={` ${sort == 3 ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 py-1`} onClick={()=> setSort(3)}>
                                            Price  
                                        </li> }

                                        <li className= {`${asc ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 p-1 mt-2`} onClick={() => setAsc(true)}>
                                            Asecending
                                        </li>

                                        <li className={`${!asc ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 p-1 mt-2`} onClick={() => setAsc(false)}>
                                            Descending
                                        </li>
                                        
                                        
                                    </ul>
                                    </div>
                                    
                                </div>

                            </div>
                        </div>}
                        <div className="">
                            <div className="" >
                                <div className="">
                                    {/* <div className="d-flex justify-content-center align-items-center h-100 fs-5 text-center">
                                        {userResponses.name ? userResponses.name: userResponses.main_category}
                                    </div> */}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mt-5 bg-slate-800/10 h-screen">
                        <div className="text-center text-2xl lg:text-3xl py-4 font-bold">
                            Choose your service:
                            {clickedService && 
                            <span className="justify-content-center position-absolute start-50 translate-middle-x">
                                <span className="text-center">Loading...</span>
                            </span>
                            }

                        </div>   
                        <div className="w-full flex justify-center">
                            <div className="h-1 bg-gray-500 w-9/10"/>   
                        </div>
         
                        <div className="overflow-x-auto ml-3 mt-3 h-full whitespace-nowrap">
                            
                            
                            {currentServices ? currentServices.map(service_object=>(
                                <div className="inline-block mr-7 h-3/5" key ={service_object.id}>
                                    
                                        <div className="h-full w-full" >
                                            {userEmail != null && <Favorites service={service_object}/>}    
                                            {sort === 0 && <div className="inline ml-2">{service_object.miles ? `Miles from ${guestAddress ? guestAddress[0] : "Placeholder" }: ` +   service_object.miles : 0 }</div> }
                                            <div className="h-full" onClick={() => getMoreInfo(service_object.id)}>
                                                <ServiceCard service = {service_object} has_fuel_type={userResponses.fuel_type}/> 
                                            </div>
                                        </div>
                                   
                                    {/* <div className="card-footer">
                                        {service_object.attributes &&     
                                        <p className="fs-6 text-wrap">Info by: <a href= {service_object.attributes.providerUri}> {service_object.attributes.provider} </a> </p> }
                                        {service_object.photos && service_object.photos[0].authorAttributions[0] &&     
                                        <p className="fs-6 text-wrap">Image By: <a href= {service_object.photos[0].authorAttributions[0].uri}> {service_object.photos[0].authorAttributions[0].displayName} </a> </p> }
                                    </div> */}
                                </div>
                                
                            )):    
                            <div className="text-center flex flex-col justify-center items-center h-100"> 
                                <div className="text-4xl mb-5 ">No services avaiable based on response. Try to search again </div>
                                <Link href={"/questionaire"}><button className="outline outline-2 text-3xl px-3 py-2 hover:bg-gray-500">Retry</button></Link>
                            </div>
                            }
     
                        </div>  
                    </div>
                </div>
            
 
        </div>
    )
}