"use client"
import "../css/address_page.css"
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
                        setGuestAddress(theInput);
                        router.push('/start');
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
            <div className="grid grid-cols-2 gap-0">
                <div className="w-full flex justify-end h-full">
                    <img className="bg-slate-700/50 w-19/20 object-cover p-5 rounded-2xl opacity-70" src ="https://cdn-icons-png.flaticon.com/512/1865/1865269.png" alt = "Map Image"/>
                </div>

                <div >
                    <h2 className="mt-10 px-10 text-5xl font-bold">Welcome {userEmail != null ? userEmail[0] : "Guest"}!</h2>
                    <p className="text-center mt-20 text-3xl pt-5 px-10 text-gray-500">Please enter either a physical address or a Zip Code to begin. This will be your starting point.</p>
                    <p className="text-center text-3xl mt-2 text-gray-500">(Recommend address for best experience).</p>
                    <div className="ml-10 mt-10 px-5">
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="addressInput" className="form-label text-3xl">Address/ZipCode</label>
                                <div className="grid grid-cols-6 mt-4">
                                    <div className="col-span-3">
                                        <input id="addressInput" value={theInput} className="form-control border-b-4 w-full text-xl pb-1" onChange={handleChange} type="text" placeholder="Enter your address here" />
                                    </div>
                                    <div className="col-span-2">
                                        <select value={selectType} className="form-select outline outline-1 outline-white p-2 ml-4 w-3/4" onChange={(event) => setSelect(event.target.value)}>
                                            <option value="" disabled>Select your type</option>
                                            <option className="text-black" value="zipCode">Zip Code</option>
                                            <option className="text-black" value="address">Address</option>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <button type="submit" className="outline outline-1 outline-white p-1 w-full">Enter</button>
                                    </div>
                                </div>
                            </form>
                    </div>
                </div>
            </div>
        </div>

        </div>




            {/* <div className="bg-secondary-subtle">
                <div className="text-center">
                    <h1 className='fs-2 fw-bold'>Welcome {userEmail != null ? userEmail[0] : "Guest"}!</h1>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
                <div className="bg-secondary-subtle main_container">
                    <p className="text-center main_text text-wrap p-3">Please enter either a physical address or a Zip Code to begin. </p>
                    <p className="text-center main_text fw-bold">(Recommend address for best experience).</p>
                    <div className="ms-5 mt-5">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="addressInput" className="form-label fs-3">Address/ZipCode</label>
                            <div className="row row-cols-3 m-0 p-0">
                                <div className="col-8">
                                    <input id="addressInput" value={theInput} className="form-control" onChange={handleChange} type="text" placeholder="Enter your address here" />
                                </div>
                                <div className="col-2">
                                    <select value={selectType} className="form-select w-100" onChange={(event) => setSelect(event.target.value)}>
                                        <option value="" disabled>Select your type</option>
                                        <option value="zipCode">Zip Code</option>
                                        <option value="address">Address</option>
                                    </select>
                                </div>
                                <div className="col-1">
                                    <button type="submit" className="btn btn-primary w-100">Enter</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>     */}
        </> 
    )

}

export default AddressPage;