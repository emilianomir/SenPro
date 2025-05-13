import { useState } from "react";
import { checkLogin, changePass } from '@/components/DBactions';

export default function Account_Modal({email}){
    const [isOpen, setIsOpen] = useState(false);
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
        checkLogin(email, oldPass).then((data) =>
            {
                if(!data){
                    alert("Invalid password");
                    return;
                }
                else 
                {   
                    changePass(email, newPass);
                    alert("Password has been changed!");
                    return;
                }
            }) 

    }



    return (
        <>

        <div className="mt-6">

            <button className='cursor-pointer p-2 bg-red-600 text-gray-100 hover:bg-red-700/90 text-xl md:text-3xl' 
            onClick={()=>{Reset();
                          setIsOpen(true)}}>Change Password</button>
        </div>
        
        <div className={`${isOpen ? "opacity-100 z-2" : "opacity-0 -z-2"} ease-out duration-300 fixed inset-0 flex items-center justify-center bg-black/50 text-content-text`}>
            <div className={`${isOpen ? "opacity-100": "opacity-0"} transition-opacity ease-in-out duration-500 bg-land-sec-bg p-6 rounded-lg shadow-lg w-3/4 h-100 relative`}>
            <h2 className="mt-3 md: mt-0 text-3xl md:text-4xl font-bold border-b-2 border-gray-200 pb-2 mb-6">Change your password</h2>
            <div>
                <form onSubmit={submitForm}>
                <div className='grid grid-cols-1'>
                    <div className="mb-5">
                        <label htmlFor="current-password" id ="current" className="text-xl md:text-2xl">Current Password:</label>
                        <input value={oldPass} type="password" onChange={oldPassChange} className="border-b-2 border-text-content/70 text-lg md:text-xl md:ml-3" id="current-password"/>
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="new-password" className="text-2xl">New Password:</label>
                        <input value={newPass} type="password" onChange={newPassChange} className="border-b-2 border-text-content/70 text-lg md:text-xl md:ml-3" id="new-password2"/>
                    </div> 
                    <div>
                        <button type = "submit" className="outline outline-2 outline-text-content/70 px-3 py-2 text-2xl hover:bg-content-text/10">Submit</button>
                    </div>
                </div>
                </form>
            </div>
            <button
            className="absolute top-0 right-0 md:mr-2 md:mt-2 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setIsOpen(false)}
            >
            Close
            </button>
        </div>
    </div>
    </>
    )
}