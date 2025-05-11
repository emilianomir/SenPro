"use client"
import { useAppContext } from '@/context';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { getUserSession, getGuestAddress} from '@/components/DBactions';
import Loading from '@/components/Loading';
import ServicePageHeading from '@/components/ServicePageHeading';


function StartPage(){
    const {userEmail, setNumberPlaces, setUserEmail, userServices, guestAddress, setGuestAddress, userAddress} = useAppContext();
    const router = useRouter();
    const [goLogin, setLogin] = useState(false);

    // Gets the session
    useEffect(() => {
        console.log(userAddress);
        const fetchProducts = async () => {
            try{
                let userName = await getUserSession();
                if (userName != null) 
                    setUserEmail([userName[0].username, userName[0].email]);
                else{
                    setLogin(true);
                    return;
                }
            } catch(error) {
                
                console.error("Error fetching DB:", error);
                alert("There was an issue getting the data.");
                
            } 
        }
        if(!userEmail) fetchProducts();
        if (userEmail && !userAddress)
            redirect("/address");
    }, []);



    useEffect(() => {
        if (goLogin) {
            router.replace("/login"); // replace() avoids back button issues
        }
      }, [goLogin]);
    
    if (goLogin) 
        return;
    

    const formSubmit = (event)=>{
        const userNumber = event.target[0].value;
        setNumberPlaces(userNumber);
        event.preventDefault();
        if (userServices.length == userNumber)
            router.push("/end");
        else
            router.push("/questionaire")

    }

    return (
        <>
        {userEmail ?
        <>
        <ServicePageHeading/>
        {/* <div className = "" >
            <div className = "text-center">
                <h1 className='text-4xl font-bold'>Hello {userEmail != null ? userEmail[0] : "Guest"}</h1>
                <div className='w-full h-1 bg-white' />
            </div>
        </div> */}
        <div className='relative w-full h-[90vh] bg-[url(/imgs/start-bg.jpg)] bg-cover'/>
        <div className="absolute top-27 left-0 h-[90vh] w-full bg-land-sec-bg/65 shadow-md" />

        <div className='absolute top-1/5 w-full h-1/2 flex justify-center'>
            <div className = "rounded-lg bg-land-card w-2/5 flex justify-center pt-5 text-content-text">
                <div className="p-3">
                    <h1 className="text-xl md:text-3xl font-bold">How many places do you want to visit? </h1>
                    <div className='flex justify-center'>
                    <form onSubmit={formSubmit}>
                    <div className="" >
                        <div className="my-2">
                            <input type="number" className="border-b-2 w-25 text-center" min = "1" max = "5" required/>
                        </div>
                        <div className="mb-2">
                            <button type="submit" className="outline outline-2 w-25">Enter</button>
                        </div>
                    </div>
                    </form>
                    </div>
                </div>
    
            </div>
        </div>

        </>
    :
        <Loading message= "Fetching Session"/>
    }
    </>
    );

}

export default StartPage;