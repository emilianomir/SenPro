"use client"
import { useAppContext } from '@/context';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { getUser, testExistingUser } from '@/components/DBactions';
import Loading from '@/components/Loading';

function StartPage(){
    const {userEmail, setNumberPlaces} = useAppContext();
    const router = useRouter();

    
    // const [sVal, setSearch] = useState(search);
    // const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);




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
    
    
    //userName = userName.toUpperCase();

    const formSubmit = (event)=>{
        const userNumber = event.target[0].value;
        setNumberPlaces(userNumber);
        event.preventDefault();
        router.push("/questionaire")

    }

    // if(loading)
    //     return (<div className='vh-100 vw-100'>
    //         <Loading message={userEmail == null ? "Setting up" : "Getting account info"} />
    //     </div>)


    return (
        <>
        <div className = "bg-secondary-subtle m-0" >
            <div className = "text-center">
                <h1 className='fs-2 fw-bold'>Hello {userEmail != null ? userEmail[0] : "Guest"}</h1>
            </div>
        </div>

        <div className="d-flex justify-content-center bg-secondary align-items-center vh-100 overflow:hidden">
            <div className = "container bg-secondary-subtle text-center h-50 row row-cols-1">
                <div className="col d-flex justify-content-center pt-4 pb-0">
                    <h1 className="fs-1 fw-bold text-center w-50">How many places do you want to visit? </h1>
                </div>
                <form onSubmit={formSubmit}>
                    <div className="col  row row-cols-1" >
                        <div className="col d-flex justify-content-center">
                            <input type="number" className="fs-3 p-3 form-control w-25 h-25 text-center" min = "1" max = "5" required/>
                        </div>
                        <div className="col">
                            <button type="submit" className="btn btn-primary w-25">Enter</button>
                        </div>
                    </div>
                </form>
  
            </div>
        </div>
       
        </>

        
    );

}

export default StartPage;