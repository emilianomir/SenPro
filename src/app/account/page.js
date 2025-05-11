"use client"
import { redirect, useServerInsertedHTML } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useAppContext } from '@/context';
import { getUser, testExistingUser, deleteUserSession} from '@/components/DBactions';
import Account_Modal from '@/components/Modals/Account_Modal';
import Loading from '@/components/Loading';



export default function Account(){
    const router = useRouter();
    const {userEmail} = useAppContext();
    if (userEmail == null)
        redirect("/login");
    // States to be user in async function. 
    const [sVal, setSearch] = useState(userEmail[1]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [smallScreen, setIsSmallScreen] = useState(true);
    const [clickedBars, setClickedBars] = useState(false);
    const [theme, setTheme] = useState('Light');


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

    useEffect(() => {
        const handleResize = () => {
          const mdBreakpoint = 768; 
          setIsSmallScreen(!(window.innerWidth >= mdBreakpoint));
        };
    
        // Add event listener on mount
        window.addEventListener("resize", handleResize);
        handleResize(); // Check immediately on mount
    
        // Clean up event listener
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    useEffect(()=> {
        const handleTheme = () => {
            const htmlElement = document.documentElement;

            if (htmlElement.classList.contains('dark')) {
              setTheme("Dark")
            } else if (htmlElement.classList.contains('light')) {
              setTheme("Light")
            } 
        }
        handleTheme();
    }, []);

    const changeTheme = ()=> {
        const htmlElement = document.documentElement;

        if (htmlElement.classList.contains('dark')) {
          htmlElement.classList.replace('dark', 'light');
          setTheme('Light');
        } else if (htmlElement.classList.contains('light')) {
            htmlElement.classList.replace('light', 'dark');
            setTheme('Dark');
        } 
    }
    

    // Logout
    const routeClick =  async () => {
        if (await deleteUserSession(userEmail[1]) != 'pending') router.push("/");
    }

    if(loading)
        return <Loading message={"Getting Account Details"} />

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='bg-land-sec-bg w-[95%] h-[95%] rounded-xl flex flex-col'>
                <div className='w-full border-b-3 border-gray-400 grid grid-cols-2'>
                    <div className='text-4xl font-extrabold ml-6 py-6 text-content-text'>
                        Settings
                    </div>
                    <div className='flex justify-end items-center py-6 mr-2 md:mr-6 text-lg md:text-2xl'>
                        <div onClick={()=>router.back()} className='text-center w-1/2 md:w-1/5 border-2 font-bold p-2 text-content-text'>
                            Back
                        </div>
                    </div>
                </div>

                <div className='flex-grow grid grid-cols-10'>
                    <div className={`${clickedBars ? "col-span-10" : "col-span-2 md:col-span-3 lg:col-span-2"} h-full border-r-2 border-gray-400 `}>
                    {smallScreen && !clickedBars? 
                        <div onClick={() => setClickedBars(true)} className='text-xl/3 flex flex-col items-center justify-center'>
                            <div>
                                ------
                            </div>
                            <div>
                                ------
                            </div>
                            <div>
                                ------
                            </div>
                            
                        </div>
                        :
                        <>
                        {smallScreen && <div onClick={() => setClickedBars(false)} className='text-xl/3 flex flex-col w-1/5 justify-center items-center'>
                            <div>
                                ------
                            </div>
                            <div>
                                ------
                            </div>
                            <div>
                                ------
                            </div>
                            
                        </div> }
                    <div className='mt-3'>
                        <div className='w-full flex justify-center'>
                            <img width="50%" src = "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Picture.png" className = "w-2/5 md: w-1/2" alt = "profileIcon" /> 
                        </div>
                        <div className='font-bold text-2xl mt-2 text-center text-content-text'>Hi {products[0].username}!</div>
                        <div className='text-xl text-account-sec-text text-center'>{products[0].email}</div>
                    </div>
                    <div className='mr-5 text-end text-3xl mt-10'>
                        <div className='mb-10 text-blue-500'>
                            Account
                        </div>
                    </div>
                    <div className='mt-5 md:mt-30 w-full flex justify-center md:justify-end text-center'>
                            <div onClick={routeClick} className='bg-red-600 w-1/2 text-3xl text-white p-3 mr-2 hover:bg-red-700/95'>
                                Log Out
                            </div>
                    </div>
                        </>

                    }

                    </div>
                    <div className={`${clickedBars ? "hidden" : "visible col-span-8 md:col-span-7 lg:col-span-8"}`}>
                        <div className=' p-6'>
                            <div className='text-4xl font-bold w-[95%] pb-3 pl-2 border-b-3 border-account-sec-text/25 text-content-text'>
                                Account
                                <div className='text-base text-account-sec-text'>
                                    View or Update Your Existing Information Below
                                </div>
                            </div>
                            <div className='mt-5 md:mt-10 pl-2'>
                                <div className='text-2xl md:text-4xl font-bold text-content-text'>
                                    UserName:                                 
                                    <div className='md:inline md:ml-2 text-account-sec-text/90'>
                                        {products[0].username}
                                    </div>
                                </div>
                                <div className='text-2xl md:text-4xl font-bold mt-4 text-content-text'>
                                    Email: 
                                    <div className='md:inline md:ml-2 text-account-sec-text/90 break-words'>
                                        {products[0].email} 
                                    </div>
                                </div>
                                <Account_Modal email={products[0].email}/>
                                <div className="mt-6 text-2xl md:text-4xl text-content-text">
                                    <div className='font-bold inline'>
                                        Address:
                                    </div> 
                                    <div className='md:ml-2 md:inline md:border-b-2'>
                                        {products[0].address == "" ? "UNKNOWN": products[0].address}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button className='rounded-lg p-2 bg-theme-btn text-gray-100 group hover:bg-theme-btn-hover text-xl md:text-3xl' 
                                    onClick={changeTheme}>
                                        {theme + " Mode" }
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
 




    )
}

