"use client"
import { useAppContext } from "@/context"
import ServicePageHeading from "@/components/ServicePageHeading";
import Image from "next/image";

export default function End(){
    const {userServices, numberPlaces} = useAppContext(); //this should have the full list of services once the user reaches decided number of services
                                        
    return(
        <div>
            <ServicePageHeading />
            <div className="text-center text-white text-3xl mt-3 font-bold">Here is your services list:</div>
            <div className="w-full flex justify-center">
                <table className="w-3/4 mt-1 mb-3">
                    <tbody >
                        {userServices.map((theService, index)=>
                            <tr key={theService.id}>
                                <td className="w-full flex justify-end py-3">
                                    <svg className="fill-white" height="100" width="100" xmlns="http://www.w3.org/2000/svg">
                                        <circle r="45" cx="50" cy="50" stroke ="gray" strokeWidth ="3" />
                                        <text className="text-3xl font-bold" x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"  fill="black">{index + 1}</text>
                                    </svg>
                                </td>
                                <td className="pl-2 border-b-2 border-b-gray-300">
                                    <div className="font-bold text-4xl my-4">
                                        {theService.displayName.text}
                                    </div>
                                    <div className="text-3xl text-gray-200 pb-3">
                                        {theService.formattedAddress}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>

    )
}