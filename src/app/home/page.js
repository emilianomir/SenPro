"use client"
import "../css/begin_page.css"
import { useAppContext } from "@/context"
import { redirect } from "next/navigation";
import RouteButton from "@/components/route_button";
import Favorites_Section from "@/components/Favorites_Section";

export default function Begin(){
    const theList = [];
    for (let i = 0; i < 5; i ++) {
        theList.push({name: "Placeholder Service " + i, photo: "https://join.travelmanagers.com.au/wp-content/uploads/2017/09/default-placeholder-300x300.png"})
    }
    const {userEmail} = useAppContext();
    if (userEmail == null)
        redirect("/login");
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
            <Favorites_Section favoritesList = {theList} />

        </div>
    )
}