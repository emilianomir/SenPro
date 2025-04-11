"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { checkLogin, createSession, getUser } from "@/components/DBactions";
import Loading from "@/components/Loading";
import { check } from "drizzle-orm/mysql-core";

export default function FormLayout ({typeForm}){
    const router = useRouter();
    const {setUserEmail} = useAppContext();
    const [yes, setYes] = useState(false);
    const [loading, setLoading] = useState(false);
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

        }
        else {
            if (!formData.inputEmail || !formData.inputPass) {
                alert("Please fill out all fields");
                return;
            }
            
        }
        setYes(true);
    };

    useEffect(() => {
      const fetchProducts = async () => {
        if (yes){
          try{
              setYes(false);
              setLoading(true);
              if(await checkLogin(formData.inputEmail, formData.inputPass)){
                await createSession(formData.inputEmail);
                let userName = await getUser(formData.inputEmail);
                setUserEmail([userName[0].username, userName[0].email]);
                router.push("/home");
              }
              else
              {
                alert("Invalid email or pass");
                return;
              }
          } catch(error) {
              console.error("Error fetching DB:", error);
              alert("There was an issue getting the data.");
          } finally {
            setLoading(false);
          }
        }
      }
      fetchProducts();
    }, [yes, formData]);



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