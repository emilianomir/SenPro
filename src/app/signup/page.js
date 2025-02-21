"use client"

import "../css/sign_up_page.css"
import RouteButton from "@/components/route_button";
import { useState } from "react";
import { useRouter } from "next/navigation";



function SignUpPage(){
    const router = useRouter();
    const [formData, changeFormData] = useState(
    {
        inputEmail: '',
        inputPass: '',
        confirmPass: ''
    });

    const changeData = (event)=>{
        const {id, value} = event.target;
        changeFormData((oldData)=>({
            ...oldData,
            [id]: value,
        }));
        
    }

    const submitForm = (event)=> {
        event.preventDefault();
        if (!formData.inputEmail || !formData.inputPass || !formData.confirmPass){
            alert("Please fill out all fields");
            return;
        }

        //enter logic here for database searching of existing user

        if (formData.inputPass != formData.confirmPass)
            alert("Passwords are not the same");
        else 
            router.push("/address?user=" + formData.inputEmail);

        
    }
    
    return (
        <div className="fullPage bg-secondary">
            <div className = "container">
                <div className = "row row-col-1 mb-5" >
                    <div className = "col title position-relative">  
                        <div className="position-absolute title_heading">
                            <h1 className = "text-white title_text">Sign In</h1>
                        </div>
                    </div>
                </div>
                <div className = "container bg-secondary-subtle ms-0 mt-5 sign_form_content">
                    <form onSubmit={submitForm}>
                        <div className="mb-3">
                            <label htmlFor="inputEmail" className="form-label fs-3 mt-3">Username: </label>
                            <input value={formData.inputEmail} onChange={changeData} type="email" placeholder="Enter your username" className="form-control" id="inputEmail" aria-describedby="emailHelp" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="inputPass" className="form-label fs-3 ">Password: </label>
                            <input value={formData.inputPass} type="password" onChange={changeData} placeholder="Enter your password" className="form-control" id="inputPass" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPass" className="form-label fs-3 ">Confirm Password: </label>
                            <div className = "row row-cols-2">
                                <div className="col-11">
                                    <input value={formData.confirmPass} onChange={changeData} type="password" placeholder="Re-enter your password" className="form-control" id="confirmPass" />
                                </div>

                                <div className="col-1">
                                    <div className="w-100 p-0">
                                        <button type = "submit" className = "btn btn-primary">Create</button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </form>
                        <h2 className = "mt-5 text-center">Already have an account?</h2>
                        <div className="mt-3 w-100 d-flex justify-content-center">
                            <div className = "w-50 d-flex justify-content-center">
                                <RouteButton name = "Login" location = "/login"/>
                            </div>
                        </div>
                </div>

            </div>
        </div>

    )
}

export default SignUpPage;