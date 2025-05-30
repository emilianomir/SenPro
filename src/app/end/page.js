"use client"
import { useAppContext } from "@/context"
import ServicePageHeading from "@/components/ServicePageHeading";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getUserSession, getInfoSession, createStatelessQ, deleteSession, getFavAPI, getCords, getGuestAddress} from '@/components/DBactions';
import { redirect, useRouter } from 'next/navigation'
import { users } from "@/db/schema/users";
import { useQRCode } from 'next-qrcode';

export default function End(){

    const {userServices, setUserEmail, setFavorites, favorites, userEmail, userAddress, setUserAddress, reset} = useAppContext(); //this should have the full list of services once the user reaches decided number of services
    if (userEmail && !userServices)
        redirect("/home");
    const { Image } = useQRCode();
    //const {userServices, numberPlaces} = useAppContext(); //this should have the full list of services once the user reaches decided number of services
    const googleMapURL = "https://www.google.com/maps/dir/";
    const addressURLS = userServices.map(service=> encodeURIComponent(service.formattedAddress.includes("#") ?
    service.formattedAddress.substr(0, service.formattedAddress.indexOf('#'))
    : service.formattedAddress));

    const fullURL = googleMapURL + ((userAddress ? userAddress[0]: "")) + "/" + addressURLS.join('/');
    const [yes, setyes] = useState(true);
    const [loading, setLoading] = useState(false);
    const [goLogin, setLogin] = useState(null);
    const router = useRouter();

    
    useEffect(() => {
        const handlePopState = () => {
            console.log("Ran");
            reset();
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
        window.removeEventListener("popstate", handlePopState);
        };
        }, []);

    useEffect(() => {
        const fetchProducts = async () => {
        if (yes){
            try{
            setyes(false);
            setLoading(true)
            let userName = await getUserSession();
            if (userName != null) {
                setUserEmail([userName[0].username, userName[0].email]);
                const cords = await getCords(userName[0].email);
                setUserAddress([userName[0].address, {latitude: cords[0], longitude: cords[1]}])
                if(!favorites){
                    const favoritesList = await getFavAPI(userName[0].email);
                    if(favoritesList) setFavorites(favoritesList);
                }
                setLogin(1);
                return;
            }
            else {
                setLogin(2);
                return;
            }
            } catch(error) {
                console.error("Error fetching DB:", error);
                alert("There was an issue getting the data.");
            } finally {
            setLoading(false);
            }
        }
        }
        if (!userEmail)
            fetchProducts();
    }, [yes]);

    useEffect(()=> {
        if (goLogin)
            redirect(goLogin == 1 ? "/home":  "/login"); 
    }, [goLogin])
            
    

    if(loading){
        return (<Loading message= "Fetching Session"/>)
    }

    if (!userEmail)
        return (<></>)
    return(
        <div className="bg-land-sec-bg h-full md:h-screen">
            <ServicePageHeading />
            <div className="px-3 text-center text-content-text text-3xl mt-3 font-bold">Here is your services list:</div>
            <div className="flex justify-center mt-3">
                <div className="max-sm:w-40 max-sm:h-40">
                    <Image
                    text={fullURL}
                    />
                </div>

            </div>
            <div className="text-center text-xl px-3 mt-3 text-content-text">Scan the QR Code above on your phone for Google Maps Link. Or Click <a className="text-blue-400 hover:underline" href={fullURL} target="_blank" rel="noopener">Here </a></div>
            <div className="w-full flex justify-center">
                <table className="w-3/4 mt-1 mb-3 overflow-auto-y">
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
                                    <div className="font-bold text-4xl my-4 text-content-text">
                                        {theService.displayName.text}
                                    </div>
                                    <div className="text-3xl text-end-sec-text pb-3 ">
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