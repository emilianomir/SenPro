import RouteButton from "@/components/route_button";
import { memo } from "react";
const Home_Squares = memo(function Home_Squares({info}) {

    console.log("Home squares ran")
    return(                        
    <div className="rounded-lg bg-land-card/50 shadow-md">
        <h3 className="text-center bg-home-h-bg rounded-t-lg text-2xl py-4 font-semibold text-white">{info.heading}</h3>
            <p className="text-center text-xl my-3 py-4">{info.text}</p>
            <div className="w-full flex justify-center pb-5"> 
                <div className="w-1/2">
                    <RouteButton name = {"GO!"} location = {info.location} />
                </div>
            </div>
    </div>
    
    )
})

export default Home_Squares