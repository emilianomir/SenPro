"use client"
import { useAppContext } from "@/context"
import ServicePageHeading from "@/components/ServicePageHeading";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getUserSession, getInfoSession, createStatelessQ, deleteSession, getFavAPI, checkRemoveOldest, getCords, getGuestAddress} from '@/components/DBactions';
import { useRouter } from 'next/navigation'
import { users } from "@/db/schema/users";
import { useQRCode } from 'next-qrcode';

export default function End(){

    const {userServices, numberPlaces, setUserEmail, setServices, setFavorites, favorites, userEmail, userAddress, setUserAddress, guestAddress, setGuestAddress} = useAppContext(); //this should have the full list of services once the user reaches decided number of services

    const { Image } = useQRCode();
    //const {userServices, numberPlaces} = useAppContext(); //this should have the full list of services once the user reaches decided number of services
    const googleMapURL = "https://www.google.com/maps/dir/";
    const addressURLS = userServices.map(service=> encodeURIComponent(service.formattedAddress.includes("#") ?
    service.formattedAddress.substr(0, service.formattedAddress.indexOf('#'))
    : service.formattedAddress));

    const fullURL = googleMapURL + (guestAddress? guestAddress[0] : (userAddress ? userAddress[0]: "")) + "/" + addressURLS.join('/');
    const [yes, setyes] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //     if (yes){
    //         try{
    //         setyes(false);
    //         let userName = await getUserSession();
    //         if (userName != null) setUserEmail([userName[0].username, userName[0].email]);
    //         let sessionValues = await getInfoSession();
    //         if(sessionValues == null || numberPlaces > 0)
    //         {

    //             if(numberPlaces > 0) await deleteSession('Qsession');
    //             let email = "HASHTHIS";
    //             if(userName)
    //             {
    //                 email = userName[0].email;
    //             }
    //             console.log(await createStatelessQ(numberPlaces, favorites, userServices, apiServices, userResponses, email));
    //         }
    //         else
    //         {
    //             setFavorites(sessionValues.favorites);
    //             setServices(sessionValues.userServices);
    //             setResponses(sessionValues.userResponses);
    //             setAPIServices(sessionValues.apiServices);
    //         }
    //         } catch(error) {
    //             console.error("Error fetching DB:", error);
    //             alert("There was an issue getting the data.");
    //         } finally {
    //         setLoading(false);
    //         }
    //     }
    //     }
    //     fetchProducts();
    // }, [yes]);
            
    

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
            }
            else if(userEmail){
                userName = [{username: userEmail[0], email:userEmail[1]}];
                if(userName[0].email != 'guest') await checkRemoveOldest(userName[0].email);
            }
            else
            {
                setUserEmail(["guest", "guest"])
                const guestAddress = await getGuestAddress();
                setGuestAddress([guestAddress.address, guestAddress.cords]);
            }


            let sessionValues = null;
            if (numberPlaces <= 0) sessionValues = await getInfoSession();
            if(sessionValues == null || numberPlaces > 0)
            {

                if(numberPlaces > 0 && sessionValues != null) await deleteSession('Qsession');
                let email = "HASHTHIS";
                if(userName)
                {
                    email = userName[0].email;
                }
                await createStatelessQ(numberPlaces, userServices, [], [], email);
            }
            else
            {
                setServices(sessionValues.userServices);
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
            
    

    if(loading){
        return (<Loading message= "Fetching Session"/>)
    }


    
    // if(loading){
    //     return (<Loading message= "Fetching Session"/>)
    // }
    return(
        <div>
            <ServicePageHeading />
            <div className="px-3 text-center text-white text-3xl mt-3 font-bold">Here is your services list:</div>
            <div className="flex justify-center mt-3">
                <Image
                text={fullURL}
                />
            </div>
            <div className="text-center text-xl px-3 mt-3">Scan the QR Code above on your phone for Google Maps Link. Or Click <a className="text-blue-200 hover:underline" href={fullURL} target="_blank" rel="noopener">Here </a></div>
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