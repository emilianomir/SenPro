"use client"
import Link from "next/link";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { checkLogin, createSession, getUser, getCords, addUser } from "@/components/DBactions";
import { useEffect, useState} from "react";
import { getUserSession} from "@/components/DBactions";


export default function FormLayout ({typeForm}){
    console.log("Ran Form")
    const router = useRouter();
    const {setUserEmail, setUserAddress, userEmail, reset} = useAppContext();
    const [message, setMessage] = useState(null);
    console.log(message);

    const alertPop = (message) => {
      return(
        <div
          className="bg-red-50 border border-red-400 rounded text-red-800 text-sm p-4 flex items-start"
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="w-full flex flex-col justify-center">
            <p>
              <span className="font-bold">{message[0]}:</span>
              {message[1]}
            </p>
            <button onClick={()=> setMessage(null)}
              className="border-red-400 bg-white hover:bg-gray-50 px-4 py-2 mt-4 border rounded font-bold"
            >
              OK
            </button>
          </div>
          <div className="">
            <svg onClick={()=> setMessage(null)}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      )
    }

    
    // Gets the session
    useEffect(() => {
      const fetchProducts = async () => {
          try{
            let userName;
            if (!userEmail)
              userName = await getUserSession();
              
            if(userName != null && userName.length != 0 ){
              router.push("/home");
            }
          } catch(error) {
              console.error("Error fetching DB:", error);
              alert("There was an issue getting the data.");
          } finally {
          }
        }
      
      fetchProducts();
    }, []);

    const submitForm = async (event) => {
        event.preventDefault();
        const theUserName = event.target.inputEmail.value;
        const thePass = event.target.inputPass.value;
        if (typeForm.name == 'Register') {
            const theConfirmPass = event.target.confirmPass.value
            if (!theUserName || !thePass || !theConfirmPass) {
                setMessage(["Alert", "Please Fill Out All Fields"]);
                return;
            }
            if (thePass != theConfirmPass) {
                setMessage(["Alert", "Passwords are not the same"]);
                return;
          }
        }
        else {
            if (!theUserName || !thePass) {
                setMessage(["Alert", "Please fill out all fields"]);
                return;
            }
            
        }

        try{
          if (typeForm.name == "Register") {
            if (await checkLogin(theUserName, thePass)){
              setMessage(["Alert", "User already exists"])
              return;
            }
            else {
              const name = theUserName.split('@')[0];
              try {
                await addUser(theUserName, name, thePass);
                setUserEmail([name, theUserName]);
                router.push("/address");
              }catch(error){
                console.error("Error adding to db: ", error)
                alert(["Error", "There was an issue adding user"])
              }
            }
          }
          else {
            if(await checkLogin(theUserName, thePass)){
              
              await createSession(theUserName);
              let userName = await getUser(theUserName);
              setUserEmail([userName[0].username, userName[0].email]);
              const temp = await getCords(userName[0].email);
              if (temp.length != 0) 
                setUserAddress([userName[0].address, {latitude: temp[0], longitude: temp[1]}])
              router.push("/home");
            }
            else
            {
              console.log(await getUser(theUserName))
              setMessage(["Alert", "Invalid email or pass"]);
              return;
            }
          }
     
        } catch(error) {
            console.error("Error fetching DB:", error);
            setMessage(["Error", "There was an issue getting the data."]);
        } 
    };

    return (    
    <div className= "w-full h-full flex justify-center items-center text-content-text">
          {message ?
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            {alertPop(message)}
          </div> : null}
          <div className="border-3 border-outline mt-5 w-4/5 md:w-3/5 h-3/5 md:h-4/5 bg-land-sec-bg/25 rounded-xl">
            <h1 className="text-center text-4xl md:text-5xl pt-3 mt-4 mb-3 text-blue-400">{typeForm.name}</h1>
            {/* <div className="w-full flex justify-center">
              <div className="w-5/6 h-1 mt-0 bg-blue-400 opacity-75"></div>
            </div> */}
            <form className="mt-4 text-xl md:text-3xl/15 xl:text-4xl/18" onSubmit={submitForm}>
              <div className="ml-10">
                <div className="grid grid-cols-1">
                  <label htmlFor="inputEmail" className="form-label">
                    Username:{" "}
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your username"
                    className="form-control border-b-4 w-5/6 text-base md:text-xl lg:text-2xl"
                    id="inputEmail"
                    aria-describedby="emailHelp"
                  />
                </div>
  
                <div className="grid grid-cols-1">
                  <label htmlFor="inputPass" className="form-label ">
                    Password:{" "}
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className=" border-b-4 w-5/6 text-base md:text-xl lg:text-2xl"
                    id="inputPass"
                  />
                </div>
  
                {typeForm.third && 
                <div>
                  <label htmlFor="confirmPass" className="">
                    Confirm Password:{" "}
                  </label>
                  <div className="flex items-center">
                    <input
                        type="password"
                        placeholder="Re-enter your password"
                        className="border-b-4 w-5/6 text-base md:text-xl lg:text-2xl"
                        id="confirmPass"
                    />
                    </div>
                </div> }
              </div>
              <div className="flex justify-center w-full">
                <button type="submit" className="mt-3 md:mt-5 px-5 shadow-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg w-1/2">
                  {typeForm.submit_name}
                </button>
              </div>
            </form>
            
            <h2 className="mt-2 md:mt-7 text-center text-lg md:text-2xl grid grid-cols-1 md:block md:pb-5 ">{typeForm.text}        
              <Link className="md:ml-4 underline text-blue-400 hover:text-blue-500" href={typeForm.link}>
                  {typeForm.link_name}
              </Link></h2>

          </div>
        </div>)
}