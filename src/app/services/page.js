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

    const router = useRouter();

    const getMoreInfo = async (index) =>{
        const desired_service = apiServices[index];
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

    const referencePoint = [31.0000, -100.0000];
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

    let dummyArray = [
            {lat: 22.6750660, long: 14.5356228, photo_image: "https://dpgdistribution.com/wp-content/uploads/2018/04/walmart.jpg", displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 201, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
            {lat: -26.1287716, long: 14.5356228, photo_image: "https://dpgdistribution.com/wp-content/uploads/2018/04/walmart.jpg", displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 21, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
            {lat: 22.6750660, long: 28.2454652, photo_image: "https://dpgdistribution.com/wp-content/uploads/2018/04/walmart.jpg", displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 13, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
            {lat: 22.6750660, long: 159.9461722, displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 10, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
            {lat: -9.4324878, long: 14.5356228, displayName: {text: "Bob's Food"}, rating: 4.1, userRatingCount: 2001, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
            {lat: 49.6246541, long: 14.5356228, displayName: {text: "Bob's Food"}, rating: 4.6, userRatingCount: 10100001, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
            {lat: 22.6750660, long: 6.1084164 ,displayName: {text: "Bob's Food"}, rating: 5.0, userRatingCount: 11, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
            {lat: 4.7335833, long: 114.6989328 ,displayName: {text: "Bob's Food"}, rating: 4.2, userRatingCount: 1, priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}},
    ];
    let sortValue = "Distance";

    const theSort = (array, property) => {
        return array.sort((a,b) => a[property] ? b[property] ? asc ? a[property]- b[property]: b[property] - a[property] : a[property]- 0: 0 - b[property]? b[property]: 0)
    }
    
    dummyArray = dummyArray.map(obj => ({...obj, miles : "Miles: " + Math.round(distanceCalculate(referencePoint[0], referencePoint[1], obj.lat, obj.long))}));

    switch(sort) {
        case 0:
            if (asc){
                dummyArray = dummyArray.sort((a,b) => distanceCalculate(referencePoint[0], referencePoint[1], a.lat, a.long) -  distanceCalculate(referencePoint[0], referencePoint[1], b.lat, b.long));
            }
            else {
                dummyArray = dummyArray.sort((a,b) => distanceCalculate(referencePoint[0], referencePoint[1], b.lat, b.long) - distanceCalculate(referencePoint[0], referencePoint[1], a.lat, a.long));    
            }
            break;
        case 1:
            dummyArray = theSort(dummyArray, "rating");
            sortValue = "Rating"
            break;
        case 2:
            dummyArray = theSort(dummyArray, "userRatingCount");
            sortValue = "Rating Count"
            break;
        default:
            break;
    }


    

    

    // if (userResponses == null)
    //     redirect("/login");

    /*
    {setStars([
        ...stars,
        {id: {index}, name: "false"}
    ])}


            console.log(apiServices);
        apiServices.map((service_object, index)=>( 
            setStars([
                ...stars,
                {id: index, name: 'false'}
            ])
        ))

    */


    // if(userResponses.name != "Favorites"){

    // useEffect(()=> {
    //     let change = true;

    //     const getInfo = async ()=> {
    //         try {
    //             const response = await fetch('/api/maps/places', {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({userResponses})
    //             });
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }
        
    //             const {services_result} = await response.json();
    //             console.log("Service result in services page: "); //debugging purposes
    //             console.log(services_result);
    //             if (change){
    //                 if (services_result) //only replace if there is at least a service 
    //                     setAPIServices(services_result);
    //                 }
    //                 setLoading(false);
                
        
    //         }catch (error) {
    //             console.error("Error fetching API:", error);
    //             alert("There was an issue getting the data.");
    //         }
    //     }
    //     if (!apiServices) //if we already have services from previous call, don't make a new call
    //         {
    //             getInfo();
    //         }
    //     console.log("The apiServices: ") //debugging
    //     console.log(apiServices);
    //     return () => {
    //         change = false;
    //         };
    // }, []);



   
    return (
        <div className="">
            <ServicePageHeading />
                <div className="">
                    <div className="w-full flex justify-end">
                        <div className="text-2xl flex mr-20 mt-3">
                            <div>
                                Sort By: 
                            </div>
                            <div className="">
                                <div className="relative ml-2">
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
                                        
                                        <li className="border-b-2 border-gray-200 hover:bg-gray-200 transtion-colors ease-in-out duration-250 py-1">
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
                        </div>
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
                    <div className="mt-5 bg-slate-800/10">
                        <div className="text-center text-3xl py-4 font-bold">
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
         
                        <div className="scroll ml-3 mt-3">
                            {/* {apiServices ? apiServices.map((service_object, index)=>( */}
                            {dummyArray ? dummyArray.map((service_object, index) => ( 
                                <div className="inline-block mr-7" key ={index}>
                                    <Link href={"/services/" + service_object.displayName.text}>
                                        <div onClick={() => {
                                            setClicked(true);
                                            userServices.push(service_object);
                                        }} >
                                            {userEmail != null && <Favorites service={service_object}/>}    
                                            <div>{service_object.miles ? service_object.miles : 0 }</div>   
                                            {/* <ServiceCard service = {service_object} has_fuel_type={userResponses.fuel_type}/>  */}
                                            <ServiceCard service = {service_object} /> 
                                        </div>
                                    </Link>
                                    {/* <div className="card-footer">
                                        {service_object.attributes &&     
                                        <p className="fs-6 text-wrap">Info by: <a href= {service_object.attributes.providerUri}> {service_object.attributes.provider} </a> </p> }
                                        {service_object.photos && service_object.photos[0].authorAttributions[0] &&     
                                        <p className="fs-6 text-wrap">Image By: <a href= {service_object.photos[0].authorAttributions[0].uri}> {service_object.photos[0].authorAttributions[0].displayName} </a> </p> }
                                    </div> */}
                                </div>
                                
                            )):    
                            <div className="text-center"> 
                                <div className="fs-1 text-white loadingSection">No services avaiable based on response. Try to search again </div>
                                <Link href={"/questionaire"}><button className="btn btn-primary">Retry</button></Link>
                            </div>
                            }
     
                        </div>  
                    </div>
                </div>
            
 
        </div>
    )
}