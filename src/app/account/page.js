"use client"
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { getUser, testExistingUser } from '@/components/DBactions';
import { checkLogin, changePass } from '@/components/DBactions';
import { Modal } from 'bootstrap';



export default function Account(){
    const searchParams = useSearchParams();
    const search = searchParams.get('user');
    const router = useRouter();

    // States to be user in async function. 
    const [sVal, setSearch] = useState(search);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [oldPass, changeOldPass] = useState("");
    const [newPass, changeNewPass] = useState("");
  


        // OnChange Events
        function oldPassChange(event)
        {
            changeOldPass(event.target.value);
        }
        function newPassChange(event)
        {
            changeNewPass(event.target.value);
        }


    // Using effect to pull necessary data from the db
    useEffect(() => {
        const fetchProducts = async () => {
            try{
                if(await testExistingUser(sVal))
                {
                    const data = await getUser(sVal);
                    setProducts(data);
                }
                else 
                {
                    setProducts([{username: "Guest User"}])
                }
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
        router.push("/welcome");
    }




    function Reset(){
        changeOldPass("");
        changeNewPass("");
    }
    // Form submission
    const submitForm = (event)=> {
        event.preventDefault();
         if (!oldPass || !newPass){
                    alert("Please fill out all fields");

                    return;
                }   
                if (oldPass === newPass){
                    alert("The new password should be different");

                    return;
                }

        // checking if initial password is correct
        checkLogin(search, oldPass).then((data) =>
            {
                if(!data){
                    alert("Invalid password");

                    return;
                }
                else 
                {   
  
                    changePass(search, newPass);
                    alert("Password has been changed!");
                    return;
                }
            }) 

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


                                <div className="col ps-5 fs-2 mt-4 text-info">

                                    <button className='btn btn-danger w-30 fs-3 h-100' data-bs-toggle="modal" data-bs-target="#reg-modal" onClick={Reset}>Change Password</button>
                                </div>
                            
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

            <div className="modal fade" id="reg-modal" tabIndex="-1" aria-labelledby="modal-title" aria-hidden="true"> 
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modal-title">Change your password</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form onSubmit={submitForm}>
                        <div className="modal-body">
                            <label htmlFor="modal-password" className="form-label">Current Password:</label>
                            <input value={oldPass} type="password" onChange={oldPassChange} className="form-control" id="modal-password"/>
                            <label htmlFor="modal-password2" className="form-label">New Password:</label>
                            <input value={newPass} type="password" onChange={newPassChange} className="form-control" id="modal-password2"/>
                        </div>  
                        <div className="modal-footer">
                            <button type = "submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                        </div>
                        </form>

                    </div>
                </div>
            </div> 
        </div>




    )
}