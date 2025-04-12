"use client"
import "../css/services_page.css"
import ServiceCard from "@/components/ServiceCard";
import ServicePageHeading from "@/components/ServicePageHeading";
import { useAppContext } from "@/context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Link from "next/link";
import Favorites from "@/components/Favorites";






export default function Services(){
    const {userResponses, userServices, apiServices, setAPIServices, userEmail} = useAppContext(); //apiServices holds a copy of the services in case the user goes back and returns to page. Also used to avoid extra API calls
    const [clickedService, setClicked] = useState(false); //loading purposes
    const [sort, setSort] = useState(4); //0: distance, 1: rating, 2: userRating count, 3: priceRange (only food)
    const [asc, setAsc] = useState(true);
    const [hideDrop, setDrop] = useState(true);
    const [sortValue, setSortValue] = useState("Distance");
    const [currentServices, setCurrentServices] = useState(apiServices);

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

    const referencePoint = [31.0000, -100.0000]; //need to use external api to convert location of user to lat and long
    const distanceCalculate = (la1, lo1, la2, lo2) => {  //uses the Haversine Formula
        const earthR = 3959; //Miles
        const convertRadius = angle => angle * Math.PI / 180;
        const lat1Radius = convertRadius(la1);
        const lat2Radius = convertRadius(la2);
        const innerEquation = Math.sin((lat2Radius-lat1Radius)/2)**2 +
                              Math.cos(lat1Radius) * Math.cos(lat2Radius) * (Math.sin(convertRadius(lo2-lo1)/2) ** 2);
        const fullEquation = 2 * earthR * Math.asin(Math.sqrt(innerEquation));
        
        return fullEquation;

    }


    // let dummyArray = [
    //         {lat: 22.6750660, long: 14.5356228, photo_image: "https://dpgdistribution.com/wp-content/uploads/2018/04/walmart.jpg", displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 201, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    //         {lat: -26.1287716, long: 14.5356228, photo_image: "https://dpgdistribution.com/wp-content/uploads/2018/04/walmart.jpg", displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 21, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    //         {lat: 22.6750660, long: 28.2454652, photo_image: "https://dpgdistribution.com/wp-content/uploads/2018/04/walmart.jpg", displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 13, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    //         {lat: 22.6750660, long: 159.9461722, displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 10, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    //         {lat: -9.4324878, long: 14.5356228, displayName: {text: "Bob's Food"}, rating: 4.1, userRatingCount: 2001, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    //         {lat: 49.6246541, long: 14.5356228, displayName: {text: "Bob's Food"}, rating: 4.6, userRatingCount: 10100001, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    //         {lat: 22.6750660, long: 6.1084164 ,displayName: {text: "Bob's Food"}, rating: 5.0, userRatingCount: 11, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    //         {lat: 4.7335833, long: 114.6989328 ,displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 1, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    // ];


    const theSort = (array, property) => {
        return [...array].sort((a,b) => a[property] ? b[property] ? asc ? a[property]- b[property]: b[property] - a[property] : a[property]- 0: 0 - b[property]? b[property]: 0)
    }
    
    //dummyArray = dummyArray.map(obj => ({...obj, miles : "Miles: " + Math.round(distanceCalculate(referencePoint[0], referencePoint[1], obj.lat, obj.long))}));
    useEffect(() => {
        const dropdownSet = () => {
            switch(sort) {
                case 0:
                    // if (asc){
                    //     //dummyArray = dummyArray.sort((a,b) => distanceCalculate(referencePoint[0], referencePoint[1], a.lat, a.long) -  distanceCalculate(referencePoint[0], referencePoint[1], b.lat, b.long));
                    //     setAPIServices(apiServices.sort((a,b) => distanceCalculate(referencePoint[0], referencePoint[1], a.location.latitude, a.location.longitude) -  distanceCalculate(referencePoint[0], referencePoint[1], b.location.latitude, b.location.longitude)));
        
                    // }
                    // else {
                    //     setAPIServices(apiServices = apiServices.sort((a,b) => distanceCalculate(referencePoint[0], referencePoint[1], b.location.latitude, b.location.longitude) - distanceCalculate(referencePoint[0], referencePoint[1], a.location.latitude, a.location.longitude)));    
                    // }
                    setSortValue("Distance")
                    break;
                case 1:
                    //dummyArray = theSort(dummyArray, "rating");
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
                                    
                                    <div className={`${hideDrop? "opacity-0 ": "opacity-100"} transition-opacity ease-out duration-250 absolute w-50 bg-white text-center text-black rounded-b shadow text-lg py-2 z-10`} id = "dropdown">
                                    <ul aria-labelledby = "dropdown">
                                        <li className={` ${sort == 0 || sort == 4 ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 py-1`} onClick={()=>setSort(0)}>
                                            Distance
                                        </li>
                                        <li className={` ${sort == 1 ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 py-1`} onClick={()=>setSort(1)}>
                                            Rating
                                        </li>
                                        <li className={` ${sort == 2 ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 py-1`} onClick={()=>setSort(2)}>
                                            Rating Count
                                        </li>
                                        
                                        <li className={` ${sort == 3 ? "bg-blue-600/90 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-300"} transtion-colors ease-in-out duration-250 py-1`} onClick={()=> setSort(3)}>
                                            Price  {/* Add logic to handle only food and drink*/}
                                        </li>

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
         
                        <div className="scroll ml-3 mt-3 h-full">
                            
                            {/* {dummyArray ? dummyArray.map((service_object, index) => (  */}
                            {currentServices ? currentServices.map(service_object=>(
                                <div className="inline-block mr-7 h-3/5" key ={service_object.id}>
                                    
                                        <div className="h-full w-full" onClick={() => getMoreInfo(service_object.id)} >
                                            {userEmail != null && <Favorites service={service_object}/>}    
                                            {/* <div>{service_object.miles ? service_object.miles : 0 }</div>    */}
                                            {/* <ServiceCard service = {service_object} has_fuel_type={userResponses.fuel_type}/>  */}
                                            <ServiceCard service = {service_object} has_fuel_type={userResponses.fuel_type}/> 
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