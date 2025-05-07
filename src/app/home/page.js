"use client"
import { useAppContext } from "@/context"
import { useRouter, redirect } from "next/navigation";
import Favorites_Section from "@/components/Favorites_Section";
import { useEffect, useState} from "react";
import { getUserSession} from "@/components/DBactions";
import Home_Squares from "@/components/Home_Squares";
import Loading from "@/components/Loading";

const info = [
    {heading: "Plan Trip", text: "Create a List of Services for Your Next Trip Plan", location:"/start"},
    {heading: "Past Trips", text: "View Your Past History of List of Services Created", location: "/history"}
]

export default function Begin(){
    const {userEmail, setUserEmail} = useAppContext();
    const [goLogin, setLogin] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [yes, setyes] = useState(true);
    const [back, setBack] = useState(false);

    // Gets the session
    useEffect(() => {
      const fetchProducts = async () => {
        try{
        
            setLoading(true)
            let userName = await getUserSession();
            if(userName == null){
                setUserEmail(["Redirecting", "Redirecting"])
                setBack(true);
            }
            else setUserEmail([userName[0].username, userName[0].email]);
          }
        
    
        catch(error) {
            console.error("Error fetching DB:", error);
            alert("There was an issue getting the data.");
        } finally {
          setLoading(false);
        }
        
      }
      if(!userEmail)fetchProducts();
}, [yes]);
  

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
                        <div className="text-center mt-10 text-3xl font-bold mb-3 py-3">
                            Closest Upcoming Trip:
                            <div className="mt-2 w-full flex justify-center">
                                <div className="w-4/5 bg-content-text/50 h-1"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        :
        <Loading message= "Fetching Session"/>
        }
        </>

    )
}