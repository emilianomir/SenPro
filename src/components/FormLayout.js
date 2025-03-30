"use client"
import Link from "next/link";
import { useState } from "react";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { checkLogin, addUser, testExistingUser } from "@/components/DBactions";

export default function FormLayout ({typeForm}){
    const router = useRouter();
    const {setUserEmail} = useAppContext()
    const [formData, changeFormData] = useState(()=>
    {
        const formDefault = {
            inputEmail: "",
            inputPass: "",
        }
        if (typeForm.third)
            formDefault.confirmPass= "";
        return formDefault;

    });

    const changeData = (event) => {
        const { id, value } = event.target;
        changeFormData((oldData) => ({
        ...oldData,
        [id]: value,
        }));
    };

    const submitForm = (event) => {
        event.preventDefault();
        if (typeForm.name == 'Register') {
            if (!formData.inputEmail || !formData.inputPass || !formData.confirmPass) {
                alert("Please fill out all fields");
                return;
            }
            if (formData.inputPass != formData.confirmPass) {
                alert("Passwords are not the same");
                return;
            }
        
            //enter logic here for database searching of existing user
            testExistingUser(formData.inputEmail).then((data) => {
                if (data) {
                alert("Email already in use");
                return;
                } else {
                // getting username from email (username should be later provided)
                let userName;
                let other;
                [userName, other] = formData.inputEmail.split("@");
                userName = userName.toUpperCase();
        
                    addUser(formData.inputEmail, userName,formData.inputPass, formData.inputAddress);
                    router.push("/address?user=" + formData.inputEmail);
                }
            });
        }
        else {
            if (!formData.inputEmail || !formData.inputPass) {
                alert("Please fill out all fields");
                return;
            }
            checkLogin(formData.inputEmail, formData.inputPass).then((data) => {
            if (!data) {
                alert("Invalid email or pass");
                return;
            } else {
                let userName = formData.inputEmail.split('@')[0].toUpperCase();
                setUserEmail([userName, formData.inputEmail]);
                router.push("/home");
            }
            });
        }

    };



    return (    
    <div className= "w-full h-full flex justify-center">
          <div className="border border-3 border-slate-500 mt-5 bg-gray-900/20 w-3/5">
            <h1 className="text-white text-center text-5xl pt-3 px-85 mt-4 mb-3">{typeForm.name}</h1>
            <div className="w-full flex justify-center">
              <div className="w-5/6 h-1 mt-0 bg-white opacity-75"></div>
            </div>
            <form className="mt-4  text-3xl/15" onSubmit={submitForm}>
              <div className="ml-10">
                <div className="grid grid-cols-1">
                  <label htmlFor="inputEmail" className="form-label">
                    Username:{" "}
                  </label>
                  <input
                    value={formData.inputEmail}
                    onChange={changeData}
                    type="email"
                    placeholder="Enter your username"
                    className="form-control border-b-4 w-5/6"
                    id="inputEmail"
                    aria-describedby="emailHelp"
                  />
                </div>
  
                <div className="grid grid-cols-1">
                  <label htmlFor="inputPass" className="form-label fs-3 ">
                    Password:{" "}
                  </label>
                  <input
                    value={formData.inputPass}
                    type="password"
                    onChange={changeData}
                    placeholder="Enter your password"
                    className="form-control border-b-4 w-5/6"
                    id="inputPass"
                  />
                </div>
  
                {typeForm.third && 
                <div>
                  <label htmlFor="confirmPass" className="form-label fs-3 ">
                    Confirm Password:{" "}
                  </label>
                  <div className="grid grid-cols-1">
                        <div>
                            <input
                                value={formData.confirmPass}
                                onChange={changeData}
                                type="password"
                                placeholder="Re-enter your password"
                                className="form-control border-b-4 w-5/6"
                                id="confirmPass"
                            />
                        </div>
                    </div>
                </div> }
              </div>
              <div className="flex justify-center w-full">
                <button type="submit" className="mt-7 px-5 outline-2 outline-white w-1/2">
                  {typeForm.submit_name}
                </button>
              </div>
            </form>
            <h2 className="mt-7 text-center text-2xl">{typeForm.text}        
              <Link className="ml-4 underline" href={typeForm.link}>
                  {typeForm.link_name}
              </Link></h2>

            {typeForm.name == "Login" &&
            <>
                <div className="w-full flex justify-center mt-3">
                    <div className="text-2xl">Or Try It Out With Guest Mode: <Link href={"/address"} className="underline">Here</Link></div>
                    {/* <Link href = "/address" passHref>
                            <button type="button"  className="px-3 py-3 text-2xl rounded border-1 border-solid btn-lg w-full border-white mt-5">Continue as Guest</button>
                    </Link> */}
                </div>

            </>
            }
  
          </div>
        </div>)
}