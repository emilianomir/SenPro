"use client"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { addUser, updateUserAddress } from "@/components/DBactions";
import Image from "next/image";
function AddressPage(){
    const router = useRouter();
    const {userEmail, setGuestAddress} = useAppContext(); //need a check to see if a user already has an address in db. This would mean its already an exisiting user. Redirect if so. 
    const [theInput, setInput] = useState('');
    const [selectType, setSelect] = useState('');

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const formSubmit = (event)=>{
        const userNumber = event.target[0].value;
        setNumberPlaces(userNumber);
        event.preventDefault();
        router.push("/questionaire")

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectType == '')
            alert("Select an option");
        else {
            try {
                console.log("formCheck function called");
                const response = await fetch('/api/validate/zipCode', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userInput: theInput, userSelection: selectType }),
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                const returnData = await response.json();
                if (!returnData.isValid) {
                    if (selectType == "zipCode") {
                        if (returnData.message)
                            alert(returnData.message);
                        else
                            alert("Enter a valid ZIP Code");
                    }

                    else if (selectType == "address")
                        alert("Enter a valid address");
                }
                else {
                    if (userEmail == null){
                        setGuestAddress([returnData.formattedAddress ? returnData.formattedAddress: theInput, returnData.info]);  //holds the formatted address and second index holds the lat and long
                        router.push("/start");
                    }
                    else {
                        try {
                            await updateUserAddress(userEmail[1], theInput);
                            router.push(`/start`); // pass user email to start page
                        } catch (error) {
                            console.error("error updating user address:", error.message);
                        }
                    }   
                }
        
            } catch (error) {
                console.error("Error fetching API:", error);
                alert("There was an issue validating the input.");
            }
        }
    

    };

    return (
        <>
        <div className="h-screen w-full flex justify-center">
        <div className="h-19/20 w-19/20 flex justify-center items-center bg-slate-900 p-5 mt-4">
            <div className="grid md:grid-cols-2 md:gap-0">
                <div className="w-full flex justify-center md:justify-end h-full">
                    <img className="bg-slate-700/50 w-3/4 md:w-19/20 object-cover p-5 rounded-2xl opacity-70" src ="https://cdn-icons-png.flaticon.com/512/1865/1865269.png" alt = "Map Image"/>
                </div>

                <div >
                    <h2 className="mt-3 md:mt-10 text-center px-10 text-xl md:text-3xl lg:text-5xl font-bold">Welcome {userEmail != null ? userEmail[0] : "Guest"}!</h2>
                    <p className="text-center lg:mt-20 text-lg md:text-2xl lg:text-3xl md:pt-5 px-10 text-gray-500">Please enter either a physical address or a Zip Code to begin. This will be your starting point.</p>
                    <p className="text-center text-base md:text-xl lg:text-3xl mt-2 text-gray-500">(Recommend address for best experience).</p>
                    <div className="md:ml-10 md:mt-10 px-5">
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="addressInput" className="form-label text-sm md:text-xl lg:text-3xl">Address/ZipCode</label>
                                <div className="grid lg:grid-cols-6 mt-4">
                                    <div className="col-span-3">
                                        <input id="addressInput" value={theInput} className="form-control border-b-4 w-full text-base md:text-lg lg:text-3xl pb-1" onChange={handleChange} type="text" placeholder="Enter your address" />
                                    </div>
                                    <div className="col-span-2">
                                        <select value={selectType} className="form-select outline outline-1 outline-white p-2 lg:ml-4 w-3/4 text-base md:text-lg lg:text-2xl" onChange={(event) => setSelect(event.target.value)}>
                                            <option value="" disabled>Select type</option>
                                            <option className="text-black" value="zipCode">Zip Code</option>
                                            <option className="text-black" value="address">Address</option>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <button type="submit" className="outline outline-1 outline-white p-1 w-full text-base md:text-lg lg:text-2xl">Enter</button>
                                    </div>
                                </div>
                            </form>
                            
                    </div>
                </div>
            </div>
        </div>

        </div>
        </> 
    )

}

export default AddressPage;