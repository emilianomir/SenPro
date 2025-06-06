"use client"
import { useAppContext } from "@/context"
import { redirect } from "next/navigation";
import RouteButton from "@/components/route_button";
import { useState, useEffect, act } from "react";
import { selectHistory, getUserSession, checkService, getAPI, addPost, postSelect} from "@/components/DBactions";
import Loading from "@/components/Loading";
import ServicePageHeading from "@/components/ServicePageHeading";
import { useQRCode } from "next-qrcode";




export default function History(){
    const {Image} = useQRCode();
    const current_date = new Date();
    const {userEmail, userAddress, setUserEmail, setHistoryData, historyData} = useAppContext();
    const [data, setData] = useState([]); 
    const [futureDate, setFutureDate] = useState([])
    const [isLoading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pastTab");
    const [pastActiveTab, setPastActiveTab] = useState(0);
    const [pastActiveSection, setPastActiveSection] = useState(0);
    const [todayActiveTab, setTodayActiveTab] = useState(0);
    const [todayActiveSection, setTodayActiveSection] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [goLogin, setLogin] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            try{
                let userName = await getUserSession();
                if (userName != null) setUserEmail([userName[0].username, userName[0].email]);
                else  {
                    setLogin(true);
                    return;
                }
                let history2;
                if (historyData == null){
                    const history = await selectHistory(userName[0].email);
                    const posts = await postSelect(userName[0].email);
                    for (let elm of history){
                        for (let elm2 of posts){
                            elm.post = elm.length === elm2.length && elm.services.every((val, i) => val === elm2.sAddress[i])
                        }
                    }
                    console.log(posts);
                    console.log("HISTORY:")
                    console.log(history);
                    history2 = await Promise.all(
                        history.map(async (info) => {
                        const updatedServices = await Promise.all(
                            info.services.map(async serviceId => {
                            const response = await fetch(`/api/maps/places?id=${serviceId}&basic=true`);
                            const {service_result} = await response.json();
                            service_result.id = serviceId
                            return service_result;
                            })
                        );
                    
                        return {
                            ...info,
                            services: updatedServices,
                        };
                        })
                    );
                    setHistoryData(history2);
                }
                else 
                    history2 = historyData;
                console.log("AFTER API");
                console.log(history2);
                const past_array =  [];
                let upcoming_array = [];
                const group_past_array = [];   
                const group_future_array = [];         
                history2.map((current)=>{
                    if (current.date >= current_date)
                        upcoming_array.push(current);
                    else {
                        past_array.push(current);
                    }
                });
                const sorted_past = past_array.sort((a,b) =>  a.date-b.date);
                
                sorted_past.map((theCurrent) => {
                    const monthAndDay = `${theCurrent.date.getMonth() + 1}/${theCurrent.date.getDate()}`;
                    let arrayMonthAndDay;
                    if (group_past_array.length > 0) {
                        arrayMonthAndDay = `${group_past_array[group_past_array.length-1][0].date.getMonth() + 1}/${group_past_array[group_past_array.length-1][0].date.getDate()}`
                    }
                    if (arrayMonthAndDay && monthAndDay == arrayMonthAndDay)
                        group_past_array[group_past_array.length-1].push(theCurrent);
                    else 
                        group_past_array.push([theCurrent]);
                })
                console.log("GROUP PAST ARRAY")
                console.log(group_past_array)
                setData(group_past_array);
                if (group_past_array.length == 0)
                    setActiveTab("todayTab");
                const sorted_future = upcoming_array.sort((a,b)=>a.date-b.date);
                sorted_future.map((theCurrent) => {
                    const monthAndDay = `${theCurrent.date.getMonth() + 1}/${theCurrent.date.getDate()}`;
                    let arrayMonthAndDay;
                    if (group_future_array.length > 0) {
                        arrayMonthAndDay = `${group_future_array[group_future_array.length-1][0].date.getMonth() + 1}/${group_future_array[group_future_array.length-1][0].date.getDate()}`
                    }
                    if (arrayMonthAndDay && monthAndDay == arrayMonthAndDay)
                        group_future_array[group_future_array.length-1].push(theCurrent);
                    else 
                    group_future_array.push([theCurrent]);
                })
                console.log("GROUP FUTURE ARRAY");
                console.log(group_future_array);
                setFutureDate(group_future_array);
                    
                // setCollapse(Array(group_past_array.length).fill(false));
                } catch(error) {
                    console.error("Error fetching DB:", error);
                    alert("There was an issue getting the data.");
                } finally {
                    setLoading(false);
                }
            }
            
            fetchInfo();
        }, []);


    useEffect(()=> {
        if (goLogin)
            redirect("/login")
    }, [goLogin])


    console.log("DATA: ")
    console.log(data);

    // API function calls


    // submit
    const submitPastForm = async (event) => {  
        event.preventDefault();
        const description = event.target.inputDescription.value;
        console.log(description);
        if(description.length > 0)
        {
            const services = [];
            {data[pastActiveTab][pastActiveSection].services.map((service, index) => (
                services.push(service.id)
            ))}
            await addPost(userEmail[1], description, services)
            setIsOpen(false);
        }
    };

    const submitTodayForm = async (event) => {  
        event.preventDefault();
        const description = event.target.inputDescription.value;
        if(description.length > 0)
        {
            const services = [];
            {futureDate[todayActiveTab][todayActiveSection].services.map((service, index) => (
                services.push(service.id)
            ))}
            await addPost(userEmail[1], description, services)
            setIsOpen(false);
        }
    };

    const urlGenerate = ()=> {
        const googleMapURL = "https://www.google.com/maps/dir/";
        const addressURLS = [];
        if (activeTab == "pastTab"){
            data[pastActiveTab][pastActiveSection].services.map(service => {
                addressURLS.push(service.formattedAddress)
            })
        }
        else {
            futureDate[todayActiveTab][todayActiveSection].services.map(service => {
                addressURLS.push(service.formattedAddress);
            })
        }
        const fullAddress = googleMapURL + userAddress[0] + "/" + addressURLS.join('/');
        return fullAddress;
    }


    // Tabbing
    const tabs = [
        {id: "pastTab", label:"Past"},
        {id: "todayTab", label: "Today"},
    ]

    const tabContent = {
        pastTab: (
            <div className="md:flex bg-history-side/50 rounded-bl-xl h-4/5">
            <ul className={`flex-column space-y space-y-4 text-sm font-medium text-content-text/50  md:me-4 md:mb-4 md:mb-0 py-5 md:pl-6 w-full ${data.length == 0 ? "md:w-26/100": "md:w-1/10"} `}>
            
                {data.map((info, index) => (
                    <li key={index}> 
                    <a className={`inline-flex items-center px-4 py-3 ${pastActiveTab === index? "text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600" : "cursor-pointer rounded-lg hover:text-content-text/75 bg-heading-border hover:bg-ind-hover-btn text-content-text/75 w-full "}`} 
                    aria-current="page" onClick={() =>{
                        setPastActiveSection(0);
                        setPastActiveTab(index);
                    } }>
                    <svg className="w-4 h-4 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 20 20">
                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                    </svg>
                    {`${info[0].date.getMonth() + 1}/${info[0].date.getDate()}`}
                    </a>
                    </li>
                ))}
            </ul>
           {data.length === 0?
            <div className="p-6 text-content-text w-full bg-land-sec-bg">
            <h3 className="text-lg md:text-3xl font-bold mb-2">No History</h3>
            </div>
            :
            <ul className="flex-column space-y space-y-4 text-sm font-medium  md:me-4 md:mb-4 md:mb-0 py-5 px-1 w-1/2 md:w-1/7">
                {data[pastActiveTab].map((info, index) => (
                    <li key={index}> 
                    <a className={`inline-flex items-center px-4 py-3 ${pastActiveSection === index? "text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600" : "cursor-pointer rounded-lg hover:text-content/70 bg-heading-border hover:bg-ind-hover-btn text-content-text/75 w-full"}`} 
                    aria-current="page" onClick={() => setPastActiveSection(index)}>
                    <svg className="w-4 h-4 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                    </svg>
                    {`${info.date.getMonth() + 1}/${info.date.getDate()} ~ ${info.date.toLocaleString([], {hour: "2-digit", minute: "2-digit"})}`}
                    </a>
                    </li>
                ))
                }
            </ul>
             }
            {data.length === 0?
            <>
            </>
            :
             <div className=" gap-2 overflow-y-auto w-full bg-land-sec-bg">
             {data[pastActiveTab][pastActiveSection].services.map((service, index) => (
                <div className="ml-4 w-9/10 h-1/3 max-sm:pt-3" key = {service.id}>
                    <div className="w-full bg-history-card/80 rounded-xl h-4/5 shadow-lg">
                        <div className="grid grid-cols-3 max-sm:grid-rows-2 md:grid-cols-12 w-full h-full gap-2">
                            <div className="row-span-2 md:col-span-1 text-content-text/75 bg-history-card-sec/85 text-2xl md:text-5xl flex justify-center items-center h-full rounded-l-lg">
                                {index + 1}
                            </div>
                            <div className={`${service.displayName.text.length > 25 ? "col-span-2 md:col-span-7" : "col-span-2 md:col-span-6"} flex flex-col h-full justify-center pl-5`}>
                                <div className="font-extrabold text-xl md:text-3xl text-content-text rounded-lg mb-2">
                                    {service.displayName.text}
                                </div>
                                <div className="text-content-text/70 font-semibold text-lg md:text-2xl">
                                    {service.formattedAddress}
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 md:col-end-12 flex justify-center items-center w-full">
                                <p className = "bg-blue-600 text-white text-center text-base md:text-2xl font-semibold px-2 py-1.5 rounded-sm ms-3 w-full"> 
                                    Rating: {service.rating ? service.rating : "N/A" }
                                        <svg className="w-4 h-4 text-yellow-300 inline mb-1 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                </p> 
                            </div>
                        </div>
                    </div>
                </div>                        
                    ))
                    }


                    <div className="mt-5 md:mt-7 w-full flex justify-center flex-row gap-3 pb-4">
                    <button className={`rounded-lg text-xl md:text-2xl py-2 px-3 ${data[pastActiveTab][pastActiveSection].post ? "bg-blue-600 text-white": "cursor-pointer hover:bg-land-hover focus:outline-2 active:bg-gray-700 text-content-text outline-2"}`} onClick={()=>setIsOpen(true)}>{data[pastActiveTab][pastActiveSection].post ? "Posted" : "Post History"}</button>
                    <button className="rounded-lg text-content-text outline-2 text-xl md:text-2xl py-2 px-3 hover:bg-land-hover focus:outline-2 active:bg-gray-700 cursor-pointer" onClick={()=>setIsOpen(2)}>Get QR Code</button>
                    <div className={`${isOpen ? "opacity-100 z-2" : "opacity-0 -z-2"} ease-out duration-300 fixed inset-0 flex items-center justify-center bg-black/50`}>
                    <div className={`${isOpen ? "opacity-100": "opacity-0"} transition-opacity ease-in-out duration-500 bg-land-sec-bg p-6 rounded-lg shadow-lg w-5/6 h-4/5 relative`}>
                    {isOpen == 1 ?
                    <>
                    <h2 className="text-3xl font-bold text-content-text">{clicked ? "Loading..." : "Description:"}</h2>
                    <div className="overflow-x-auto whitespace-nowrap h-9/10">
                    <form className="mt-5 text-xl md:text-3xl/15 xl:text-4xl/18" onSubmit={submitPastForm}>
                        <div className="ml-5">
                        <div className="grid grid-cols-1 text-content-text">
                            <input
                            type="description"
                            placeholder="Enter a description for your post"
                            className="form-control border-b-4 w-5/6 text-base md:text-xl lg:text-2xl"
                            id="inputDescription"
                            />
                        </div>
                        <button type="submit" className="mt-5 md:mt-2 px-5 shadow-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg w-1/6" 
                        >
                        Submit
                        </button>
                        </div>
                        </form>
                    </div>
                    </>
                    :
                    <div className="w-full flex flex-col items-center justify-center">
                        <h1 className="text-4xl text-content-text font-bold mb-5">Revist this Plan!</h1>
                        <div className="h-50 w-50">
                        <Image text ={urlGenerate()} />
                        </div>
                        <div className="text-center text-xl px-3 mt-3 text-content-text">Scan the QR Code above on your phone for Google Maps Link. Or Click <a className="text-blue-400 hover:underline" href={urlGenerate()} target="_blank" rel="noopener">Here </a></div>
                    </div>
                    }
                    <button
                    className="bg-red-500 text-white px-4 py-2 rounded absolute top-0 right-0 mr-2 mt-2"
                    onClick={() => setIsOpen(false)}
                    >
                    Close
                    </button>
                    </div>
                    </div>
                    </div>


                </div>
                }
        </div>
        
        ),
        todayTab: (
            <div className="md:flex bg-history-side/50 rounded-bl-xl h-4/5">
            <ul className="flex-column space-y space-y-4 text-sm font-medium text-content-text/50  md:me-4 md:mb-4 md:mb-0 py-5 md:pl-6 w-full md:w-1/10">
            
                {futureDate.map((info, index) => (
                    <li key={index}> 
                    <a className={`inline-flex items-center px-4 py-3 ${todayActiveTab === index? "text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600" : "cursor-pointer rounded-lg hover:text-content/70 bg-heading-border hover:bg-ind-hover-btn text-content-text/75 w-full"}`} 
                    aria-current="page" onClick={() => {
                        setTodayActiveSection(0);
                        setTodayActiveTab(index);
                    }
                    }
                    >
                    <svg className="w-4 h-4 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                    </svg>
                    {`${info[0].date.getMonth() + 1}/${info[0].date.getDate()}`}
                    </a>
                    </li>
                ))}
            </ul>
           {futureDate.length === 0?
            <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No History</h3>
            </div>
            :
            <ul className="flex-column space-y space-y-4 text-sm font-medium  md:me-4 md:mb-4 md:mb-0 py-5 px-1 w-1/2 md:w-1/7">
                {futureDate[todayActiveTab].map((info, index) => (
                    <li key={index}> 
                    <a className={`inline-flex items-center px-4 py-3 ${todayActiveSection === index? "text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600" : "cursor-pointer rounded-lg hover:text-content/70 bg-heading-border hover:bg-ind-hover-btn text-content-text/75 w-full"}`} 
                    aria-current="page" onClick={ () => setTodayActiveSection(index)}>
                    <svg className="w-4 h-4 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                    </svg>
                    {`${info.date.getMonth() + 1}/${info.date.getDate()} ~ ${info.date.toLocaleString([], {hour: "2-digit", minute: "2-digit"})}`}
                    </a>
                    </li>
                ))
                }
            </ul>
             }
            {futureDate.length === 0?
            <>
            </>
            :
            <div className=" gap-2 overflow-y-auto w-full bg-land-sec-bg">
                {futureDate[todayActiveTab][todayActiveSection].services.map((service, index) => (
                <div className="ml-4 w-9/10 h-1/3 max-sm:pt-3" key = {service.id}>
                    <div className="w-full bg-history-card/80 rounded-xl h-4/5 shadow-lg">
                        <div className="grid grid-cols-3 max-sm:grid-rows-2 md:grid-cols-12 w-full h-full gap-2">
                            <div className="row-span-2 md:col-span-1 text-content-text/75 bg-history-card-sec/85 text-2xl md:text-5xl flex justify-center items-center h-full rounded-l-lg">
                                {index + 1}
                            </div>
                            <div className={`${service.displayName.text.length > 25 ? "col-span-2 md:col-span-7" : "col-span-2 md:col-span-6"} flex flex-col h-full justify-center pl-5`}>
                                <div className="font-extrabold text-xl md:text-3xl text-content-text rounded-lg mb-2">
                                    {service.displayName.text}
                                </div>
                                <div className="text-content-text/70 font-semibold text-lg md:text-2xl">
                                    {service.formattedAddress}
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 md:col-end-12 flex justify-center items-center w-full">
                                <p className = "bg-blue-600 text-white text-center text-base md:text-2xl font-semibold px-2 py-1.5 rounded-sm ms-3 w-full"> 
                                    Rating: {service.rating ? service.rating : "N/A" }
                                        <svg className="w-4 h-4 text-yellow-300 inline mb-1 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                </p> 
                            </div>
                        </div>
                    </div>
                </div> 
                ))}


                <div className="mt-5 md:mt-10 w-full flex flex-row gap-3 justify-center pb-10">
                    <button className={`rounded-lg text-xl md:text-2xl py-2 px-3 ${futureDate[todayActiveTab][todayActiveSection].post ? "bg-blue-600 text-white": "cursor-pointer hover:bg-land-hover focus:outline-2 active:bg-gray-700 text-content-text outline-2"}`} onClick={()=>setIsOpen(1)}>{futureDate[todayActiveTab][todayActiveSection].post ? "Posted" : "Post History"}</button>
                    <button className="rounded-lg text-content-text outline-2 text-xl md:text-2xl py-2 px-3 hover:bg-land-hover focus:outline-2 active:bg-gray-700 cursor-pointer" onClick={()=>setIsOpen(2)}>Get QR Code</button>
                    <div className={`${isOpen ? "opacity-100 z-2" : "opacity-0 -z-2"} ease-out duration-300 fixed inset-0 flex items-center justify-center bg-black/50`}>
                    <div className={`${isOpen ? "opacity-100": "opacity-0"} transition-opacity ease-in-out duration-500 bg-land-sec-bg p-6 rounded-lg shadow-lg w-5/6 h-4/5 relative`}>
                    {isOpen == 1 ?
                    <>
                    <h2 className="text-3xl font-bold text-content-text">{clicked ? "Loading..." : "Description:"}</h2>
                    <div className="overflow-x-auto whitespace-nowrap h-9/10">
                    <form className="mt-5 text-xl md:text-3xl/15 xl:text-4xl/18" onSubmit={submitTodayForm}>
                        <div className="ml-5">
                        <div className="grid grid-cols-1">
                            <input
                            type="description"
                            placeholder="Enter a description for your post"
                            className="form-control border-b-4 w-5/6 text-base md:text-xl lg:text-2xl"
                            id="inputDescription"
                            />
                        </div>
                        <button type="submit" className="mt-5 md:mt-2 px-5 shadow-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg w-1/6" 
                        >
                        Submit
                        </button>
                        </div>
                        </form>
                    </div>
                    </>
                    :
                    <div className="w-full flex flex-col items-center justify-center">
                        <h1 className="text-4xl text-content-text font-bold mb-5">Revist this Plan!</h1>
                        <div className="h-50 w-50">
                        <Image text ={urlGenerate()} />
                        </div>
                        <div className="text-center text-xl px-3 mt-3 text-content-text">Scan the QR Code above on your phone for Google Maps Link. Or Click <a className="text-blue-400 hover:underline" href={urlGenerate()} target="_blank" rel="noopener">Here </a></div>
                    </div>
                    } 
                    <button
                    className="bg-red-500 text-white px-4 py-2 rounded absolute top-0 right-0 mr-2 mt-2"
                    onClick={() => setIsOpen(false)}
                    >
                    Close
                    </button>
                    </div>
                    </div>
                    </div>

            </div>
                }
        </div>
        )
    }


    if(isLoading){
        return (<Loading message= "Fetching History"/>)
    }
    else { 
        return(
            <div className="h-screen bg-land-sec-bg overflow-y-hidden">
            <ServicePageHeading heading ={"History"}/>
            
            {(data.length === 0 && futureDate.length === 0) ?
            <div className="container w-full h-[75vh] mt-4">   
            <div className=" flex flex-col h-full items-center justify-center text-content-text">
                <h2 className="text-center text-2xl md:text-3xl px-3 mb-3">No Previous History. Make one to show up here!</h2>
                <RouteButton name ={"Make Plan!"} location={"/start"} />
            </div>
            </div>
            :
            <div className="h-full">
                <div className="flex flex-wrap boarder-b w-full md:w-14/65 bg-history-side/50 pl-2 rounded-tl-2xl">
                    {tabs.map((tab) => (
                        tab.label == "Past" ?

                        data.length > 0 && <button key={tab.id} className={`inline-block p-4 text-xl ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" 
                            : "cursor-pointer border-b-2 border-transparent text-content-text rounded-t-lg hover:text-content-text/60 hover:border-gray-300"}`} onClick={() => setActiveTab(tab.id)}>
                                {tab.label}
                            </button>
                        :
                        futureDate.length > 0 && <button key={tab.id} className={`inline-block p-4 text-xl ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" 
                            : "cursor-pointer border-b-2 border-transparent text-content-text rounded-t-lg hover:text-content-text/60 hover:border-gray-300"}`} onClick={() => setActiveTab(tab.id)}>
                                {tab.label}
                        </button>

                    ))}
                </div>
                <div className="h-full">
                    {tabContent[activeTab]}
                </div>  
            </div>
            }
            </div>
        )
    }
}


