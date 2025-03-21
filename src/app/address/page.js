"use client"
import "../css/address_page.css"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { addUser, updateUserAddress } from "@/components/DBactions";
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
                    if (selectType == "zipCode")
                        alert("Enter a valid ZIP Code");
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
            <div className="bg-secondary-subtle">
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
            </div>    
        </> 
    )

}

export default AddressPage;