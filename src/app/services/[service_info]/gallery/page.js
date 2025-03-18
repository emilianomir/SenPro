"use client"
import ServicePageHeading from "@/components/ServicePageHeading"
import { useAppContext } from "@/context"
import Service_Image from "@/components/Service_Image";
import { redirect } from "next/navigation";
export default function Gallery (){
    const {userServices} = useAppContext();
    const current_service = userServices[userServices.length-1];


    // useEffect(()=>{
    //     (async () => {
    //         const temp = [];
    //         if (current_service.photos == undefined)
    //             return;

    //         for (let i = 1; i < current_service.photos.length; i ++) {
    //             current_service.photos[i];
    //             // const response = await fetch('/api/maps/places?thePhoto=' + current_service.photos[i].name);
    //             // if (response.ok)
    //             //     temp.push(response.url);
    //         }
    //         // current_service.photo_images_urls = temp;
    //         // setLoading(true);
    //     })();
    // }, [])


    console.log("Ran");
    return (
        <>
            <ServicePageHeading />
            <div className="container">
                <h1 className="text-center fw-bolder text-white">Gallery</h1>
                <div className="scroll mt-4">
                    {
                    current_service.photo_images_urls.map((theUrl)=>(
                        <Service_Image key = {theUrl} url = {theUrl}/>
                    ))
                    }
                </div>
            </div>
        </>
    )
}