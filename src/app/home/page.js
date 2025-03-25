"use client"
import "../css/begin_page.css"
import { useAppContext } from "@/context"
import { redirect } from "next/navigation";
import RouteButton from "@/components/route_button";
import Favorites_Section from "@/components/Favorites_Section";
import { useEffect, useState } from "react";

export default function Begin(){
    //add setFavorites to context
    const {userEmail} = useAppContext();
    const [loading, setLoading] = useState(true);

    const theList = [];
    for (let i = 0; i < 5; i ++) {
        theList.push({name: "Placeholder Service " + i, photo: "https://join.travelmanagers.com.au/wp-content/uploads/2017/09/default-placeholder-300x300.png"})
    }

    /*    
    //Use this to replace the favorites. 
    useEffect(() => {
        const fetchInfo = async () => {
            //replace this array with the values given by the database. 
            const ids = ["ChIJwSkWH4WjQIYRi3iahd-V1OM", "ChIJ5czsQj-kQIYRK6YeTjweipY"];
            const servicesInformation = [];
            const servicesCalls = ids.map(async id => {
                try {
                    const response = await fetch(`/api/maps/places?id=` + id );
                    if (response.ok) {
                        const {service_result} = await response.json();
                        if (service_result.photos)
                        try {
                            const img_response = await fetch(`/api/maps/places?thePhoto=` + service_result.photos[0].name);
                            if (img_response.ok) {
                                service_result.photoURL = img_response.url; 
                            }
                        }catch(error) {
                            console.error("Error fetching image for id " + id + ":", error);
                        }
                        return service_result;
                    }
                }catch(error) {
                    console.error("Error fetching service " + id + ":", error);
                }
            });
            const waitCalls = await Promise.all(servicesCalls);
            waitCalls.forEach(result => {
                if (result) servicesInformation.push(result)
            });
            console.log("SERVICES INFO ARRAY")
            console.log(servicesInformation);
            setFavorites(servicesInformation);
            setLoading(false);
        }
            fetchInfo();
        }, []);

    */

    // if (userEmail == null)
    //     redirect("/login");
    return (
        <div className="container">
            <div className="mt-3">
                <h1 className="fs-1 text-white text-center fw-bolder">Welcome {userEmail[0]} </h1>
                <div className="fs-2 text-white text-center mt-3">What are you planning to do today?</div>
            </div>
            <div className="container mt-4 squares">
                <div className="row row-col-2 h-100 mt-5">
                    <div className="col w-100 h-75 bg-secondary-subtle me-4">
                        <h2 className="text-center fw-bolder mt-3 pt-4 fs-1">Plan Trip</h2>
                        <div className="d-flex justify-content-center mt-5"> 
                            <div className="w-50">
                                <RouteButton name = {"GO!"} location = {"/start"} />
                            </div>
                        </div>
                    </div>
                    <div className="col w-100 h-75 bg-secondary-subtle">
                        <h2 className="text-center fw-bolder mt-3 pt-4 fs-1">View Past Trips</h2>
                        <div className="d-flex justify-content-center mt-5"> 
                            <div className="w-50">
                                <RouteButton name = {"GO!"} location = {"/history"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fs-2 text-white text-center fw-bolder mb-3">Your Favorites Section:</div>
            <Favorites_Section favoritesList={theList}/>
            
        </div>
    )
}