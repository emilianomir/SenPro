"use client"
import { useAppContext } from '@/context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { getUserSession } from '@/components/DBactions';
import Loading from '@/components/Loading';

function StartPage(){
    const {userEmail, setNumberPlaces, setUserEmail} = useAppContext();
    const router = useRouter();
    const [yes, setyes] = useState(true);

    
    // const [sVal, setSearch] = useState(search);
    // const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gets the session
    useEffect(() => {
        const fetchProducts = async () => {
        if (yes){
            try{
            setyes(false);
            let userName = await getUserSession();
            if (userName != null) setUserEmail([userName[0].username, userName[0].email]);
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


    // //[userName, other] = search.split('@');
    //     useEffect(() => {
    //         const fetchProducts = async () => {
    //             try{
    //                 if(await testExistingUser(sVal))
    //                 {
    //                     const data = await getUser(sVal);
    //                     setProducts(data);
    //                 }
    //                 else 
    //                 {
    //                     setProducts([{username: "Guest User"}])
    //                 }
    //             } catch(error) {
    //                 console.error("Error fetching DB:", error);
    //                 alert("There was an issue getting the data.");
    //             } finally {
    //                 setLoading(false);
    //             }
    //         }

    //         fetchProducts();
    //     }, []);
    

    const formSubmit = (event)=>{
        const userNumber = event.target[0].value;
        setNumberPlaces(userNumber);
        event.preventDefault();
        router.push("/questionaire")

    }

    if(loading){
        return (<Loading message= "Fetching Session"/>)
    }
    return (
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

        
    );

}

export default StartPage;