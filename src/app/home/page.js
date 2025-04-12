"use client"
import "../css/begin_page.css"
import { useAppContext } from "@/context"
import { redirect } from "next/navigation";
import Favorites_Section from "@/components/Favorites_Section";
import { useEffect, useState } from "react";
import Home_Squares from "@/components/Home_Squares";
import ServiceCard from "@/components/ServiceCard";

import { getSession, getUserFS, getUser} from "@/components/DBactions";
import Loading from "@/components/Loading";

export default function Begin(){
    //add setFavorites to context
    const {userEmail, setUserEmail} = useAppContext();
    const [loading, setLoading] = useState(true);
    const [yes, setyes] = useState(true);


    // Gets the session
    useEffect(() => {
      const fetchProducts = async () => {
        if (yes){
          try{
            setyes(false);
            let session = await getSession();
            let value = await getUserFS(session.idval);
            let userName = await getUser(value[0].email);
            setUserEmail([userName[0].username, value[0].email]);
          } catch(error) {
              console.error("Error fetching DB:", error);
              alert("There was an issue getting the data.");
          } finally {
            setLoading(false);
          }
        }
      }
      fetchProducts();
    }, [yes]);
    const [isOpen, setIsOpen] = useState(false);

    const dummyService = {photo_image: "https://dpgdistribution.com/wp-content/uploads/2018/04/walmart.jpg", displayName: {text: "This is a really long test. How can a service have this much text? A service does not exist like this. Right?"}, rating: 4.2} 
    // priceRange: {startPrice: {units: "400"}, endPrice: {units: "500"}}
    //photo_image: "https://dpgdistribution.com/wp-content/uploads/2018/04/walmart.jpg"
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

    if(loading){
        return (<Loading message= "Fetching Session"/>)
    }
    return (
        <div className="h-350">
            <div className="w-full h-full mt-5 flex justify-center">
                <div className="bg-slate-800 h-19/20 w-19/20 rounded-xl pb-0 ">
                    <div className="h-1/8 bg-slate-500/25 text-center rounded-t-xl">
                        <h1 className="px-1 text-4xl md:text-5xl pt-6 font-bold">Welcome {userEmail[0]}</h1>
                        <h2 className="text-2xl md:text-3xl mt-4 font-semibold">What are you planning to do today?</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mx-4 mt-7">
                        <Home_Squares info={{heading: "Plan Trip", text: "Create a List of Services for Your Next Trip Plan", location:"/start"}} />
                        <Home_Squares info ={{heading: "Past Trips", text: "View Your Past History of List of Services Created", location: "/history"}} />
                    </div>
                    <div>
                        <div className="text-white text-center mt-10 text-3xl font-bold mb-3 py-3 mb-3">
                            Your Favorites Section:
                            <div className="mt-2 w-full flex justify-center">
                                <div className="w-4/5 bg-white/50 h-1"/>
                            </div>
                        </div>
                        <Favorites_Section favoritesList={theList}/>
                    </div>
                    <div>
                        <div className="text-white text-center mt-10 text-3xl font-bold mb-3 py-3">
                            Closest Upcoming Trip:
                            <div className="mt-2 w-full flex justify-center">
                                <div className="w-4/5 bg-white/50 h-1"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         


        </div>

    )
}