"use client"
import { useAppContext } from "@/context"
import ServicePageHeading from "@/components/ServicePageHeading";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getUserSession, getInfoSession, createStatelessQ, deleteSession} from '@/components/DBactions';
import "../css/end_page.css"
import { useRouter } from 'next/navigation'
import { users } from "@/db/schema/users";

export default function End(){
    const {userServices, numberPlaces, userEmail, setUserEmail, setServices, setAPIServices, setFavorites,favorites, apiServices, userResponses, setResponses} = useAppContext(); //this should have the full list of services once the user reaches decided number of services
    const [yes, setyes] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const fetchProducts = async () => {
        if (yes){
            try{
            setyes(false);
            let userName = await getUserSession();
            if (userName != null) setUserEmail([userName[0].username, userName[0].email]);
            let sessionValues = await getInfoSession();
            if(sessionValues == null || numberPlaces > 0)
            {

                if(numberPlaces > 0) await deleteSession('Qsession');
                let email = "HASHTHIS";
                if(userName)
                {
                    email = userName[0].email;
                }
                console.log(await createStatelessQ(numberPlaces, favorites, userServices, apiServices, userResponses, email));
            }
            else
            {
                setFavorites(sessionValues.favorites);
                setServices(sessionValues.userServices);
                setResponses(sessionValues.userResponses);
                setAPIServices(sessionValues.apiServices);
            }
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
            
    

    
    if(loading){
        return (<Loading message= "Fetching Session"/>)
    }
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