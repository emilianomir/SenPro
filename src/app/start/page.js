"use client"
import { useAppContext } from '@/context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { getUserSession, getGuestAddress} from '@/components/DBactions';
import Loading from '@/components/Loading';

function StartPage(){
    const {userEmail, setNumberPlaces, setUserEmail, userServices, guestAddress, setGuestAddress} = useAppContext();
    const router = useRouter();
    const [goLogin, setLogin] = useState(false);

    // Gets the session
    useEffect(() => {
        const fetchProducts = async () => {
            try{
                let userName = await getUserSession();
                if (userName != null)
                    setUserEmail([userName[0].username, userName[0].email]);
                // else 
                //     setLogin(true);
                else{
                    setUserEmail(["guest", "guest"]);
                    const guestAddress = await getGuestAddress();
                    setGuestAddress([guestAddress.address, guestAddress.cords]);
                }
            } catch(error) {
                
                console.error("Error fetching DB:", error);
                alert("There was an issue getting the data.");
                
            } 
        }
        if(!userEmail) fetchProducts();
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
        
        <div className = "" >
            <div className = "text-center">
                <h1 className='text-4xl font-bold'>Hello {userEmail != null ? userEmail[0] : "Guest"}</h1>
                <div className='w-full h-1 bg-white' />
            </div>
        </div>

        <div className="flex justify-center text-center mt-20">
            <div className = "border border-2 bg-slate-800">
                <div className="p-3">
                    <h1 className="w-50 text-xl">How many places do you want to visit? </h1>
                </div>
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
        </>
    :
        <Loading message= "Fetching Session"/>
    }
    </>
    );

}

export default StartPage;