"use client"
import ServicePageHeading from "@/components/ServicePageHeading"
import { useAppContext } from "@/context"
import Service_Image from "@/components/Service_Image";
import { redirect } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/Loading";
export default function Gallery (){
    const {userServices} = useAppContext();
    const current_service = userServices[userServices.length-1];
    const [theServiceList, setServicesList] = useState([]);
    (async () => {
        const temp = [];
        for (let i of current_service.photoURLs) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            temp.push(<Service_Image key = {i} url = {i}/>);
        }
        setServicesList(temp);
    })();

    console.log("Ran");
    return (
        <>
            <ServicePageHeading />
            <div className="container">
                <h1 className="text-center fw-bolder text-white">Gallery</h1>
                <div className="scroll mt-4">
                    {theServiceList.length > 0 ? 
                    (theServiceList)
                    : <Loading message={"Fetching Images"}/>}
                </div>
            </div>
        </>
    )
}