"use client"

import ServicePageHeading from "@/components/ServicePageHeading"
import { useAppContext } from "@/context"
import { redirect } from "next/navigation";
export default function Fuel_Prices(){
    const {userServices} = useAppContext();
    const current_service = userServices[userServices.length-1];
    console.log(current_service);
    if (current_service.fuelOptions == undefined)
        redirect("/questionaire");
    return(
        <>
            <ServicePageHeading />
            <div className="container">
                <h1 className="text-center text-white fw-bolder mt-4">Fuel Prices of {current_service.displayName.text}</h1>
                <div className="scroll text-center mt-4">
                    {current_service.fuelOptions.fuelPrices.map((item)=> (
                        <div key = {item.type} className="bg-white text-center d-inline-block me-4 p-4">
                            <div className="fs-2 fw-bold">{item.type}</div>
                            <div className="fs-2">Price:</div>
                            <div className="fs-2 fw-bold">{item.price.currencyCode == "USD" && "$"} {Number(item.price.units)  + (item.price.nanos/1000000000)} </div>
                        </div>
                    ))}
                </div>
            </div>
        </>

    )
}