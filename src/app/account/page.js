"use client"
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useAppContext } from '@/context';
import { getUser, testExistingUser } from '@/components/DBactions';
import Account_Modal from '@/components/Modals/Account_Modal';



export default function Account(){
    const router = useRouter();
    const {userEmail} = useAppContext();
    if (userEmail == null)
        redirect("/login");
    // States to be user in async function. 
    const [sVal, setSearch] = useState(userEmail[1]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    // Using effect to pull necessary data from the db
    useEffect(() => {
        const fetchProducts = async () => {
            try{
                const data = await getUser(sVal);
                setProducts(data);             
            } catch(error) {
                console.error("Error fetching DB:", error);
                alert("There was an issue getting the data.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);


    // Logout
    const routeClick = () => {
        router.push("/");
    }


    if(loading)
        return <p>loading...</p>

    return (
        <div className="container">
            <div>
                <button className="btn btn-primary" onClick={()=>router.back()}>Back</button>
            </div>
            <div className="container">
                <div className="text-center mb-5 border-bottom"><h1 className="fs-1 text-white fw-bolder">Hi {products[0].username}!</h1></div>
                <div className="row row-cols-2">
                    <div className="col-2 m-0 p-0">
                        <div className="row row-cols-1 w-100 m-0 p-0">
                            <div className="col w-100 m-0 p-0 pb-1">
                                <button className="btn btn-primary w-100">Settings</button>
                            </div>
                            <div className="col w-100 m-0 p-0 pb-1 mb-5">
                                <button className = "btn btn-dark w-100">Reviews</button>
                            </div>

                        </div>
                    </div>
                    <div className="col-10 bg-secondary-subtle m-0 p-0">
                        <div className="container">
                            <h2 className="text-center pt-4">Account Settings</h2>
                            <div className="row row-cols-1">
                                <div className="col ps-5 fs-2 mt-4">
                                    UserName: {products[0].username}
                                </div>


                                <Account_Modal email={products[0].email}/>
                                <div className="col ps-5 fs-2 mt-4">
                                    Email: {products[0].email}
                                </div>
                                <div className="col ps-5 fs-2 mt-4">
                                    Address: {products[0].address}
                                </div>

                                <div className="col w-25 ps-5 mt-5 pb-5 h-100">
                                    <button className="btn btn-danger w-100 fs-3 h-100" onClick={routeClick}>Log Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>




    )
}