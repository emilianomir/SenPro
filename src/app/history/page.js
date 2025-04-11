"use client"
import { useAppContext } from "@/context"
import { redirect } from "next/navigation";
import RouteButton from "@/components/route_button";
import { useState, useEffect } from "react";
import { selectHistory } from "@/components/DBactions";
import Loading from "@/components/Loading";
import Image from "next/image";




export default function History(){
    const current_date = new Date();
    const {userEmail} = useAppContext();
    const [changed, setChanged] = useState([false, false]);
    const [collapse, setCollapse] = useState(null);
    const [data, setData] = useState(null); 
    const [futureDate, setFutureDate] = useState(null)
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [optionSelect, setOptionSelect] = useState([0, {services: "Select Service"}]);
    // if (userEmail === null)
    //     redirect("/login");

    useEffect(() => {
        const fetchInfo = async () => {
            try{
                const history = await selectHistory(userEmail[1]);
                console.log("HISTORY:")
                console.log(history);
                const past_array =  [];
                let upcoming_array = [];
                const group_past_array = [];            
                history.map((current)=>{
                    if (current.date >= current_date)
                        upcoming_array.push(current);
                    else {
                        past_array.push(current);
                    }
                });
                const sorted_past = past_array.sort((a,b) =>  a.date-b.date);
                setFutureDate(upcoming_array.sort((a,b)=>a.date-b.date));
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

    console.log("DATA: ")
    console.log(data);
    // console.log(collapse)

    if(isLoading){
        return (<Loading message= "Fetching History"/>)
    }
    else { 
        return( 
            <div className="container w-100 vh-100 mt-4">
                <h1 className="text-center text-white fs-1 fw-bolder">History</h1> 
                <div className="d-flex justify-content-center w-100 h-100 mt-4">
                    {data.length === 0 ?   
                    <div>
                        <h2>No Previous History. Make one to show up here!</h2>
                        <RouteButton name ={"Make Plan!"} location={"/start"} />
                    </div>
                    :
                    <div className="row row-col-2 w-100 h-100">
                        <div className="col-2 h-25">
                            <div className="row row-cols-1 h-25">
                                <div className="col bg-danger" onClick={() =>{
                                    setChanged([!changed[0], changed[1]])
                                } }>
                                    <p className="fw-bold fs-3 text-center">Past</p>
                                </div>
                                {changed[0] &&  
                                <div className="col p-0">
                                    {data.map((ptHistory, index)=> 
                                    <div key = {index}>
                                        <div className="fs-4 text-end border border-1 pe-3 bg-white" onClick={()=> {
                                        const temp = document.getElementById(`${index} full_dates`);
                                        temp.classList.contains("d-none") ? temp.classList.remove("d-none") : temp.classList.add("d-none")}}>
                                            {`${ptHistory[0].date.getMonth() + 1}/${ptHistory[0].date.getDate()}`}
                                        </div>
                                        <div id = {`${index} full_dates`} className="d-none">
                                            {data[index].map((info, date_index)=> 
                                            <div key = {(date_index + 1) + (10 * index)} className={` ${optionSelect[0] === (date_index + 1) + (10* index) ? "d-flex p-1 bd-highlight bg-info" : " d-flex p-1 bd-highlight bg-white"} fs-4 border border-2 ps-3 me-0`}
                                            onClick={() => setOptionSelect([(date_index + 1) + (10 * index), info])} >   
                                                {`${info.date.getMonth() + 1}/${info.date.getDate()} ~ ${info.date.toLocaleString([], {hour: "2-digit", minute: "2-digit"})}`}
                                            </div>
                                            )}
                                        </div>
                                    </div>)}

                                </div> 
                                }
                                <div className="col bg-primary" onClick={() => setChanged([changed[0], !changed[1]])}>
                                    <p className="fw-bold fs-3 text-center">Today</p>
                                </div>
                                {changed[1] && 
                                <div className="col p-0">
                                {futureDate.map((upHistory, index) => (
                                        <div className={`${optionSelect[0] === index + data.length? "d-flex p-1 bd-highlight bg-info" : " d-flex p-1 bd-highlight bg-white"} fs-4 text-end border border-2 pe-3`} key = {`${index + data.length}-${upHistory.services.formattedAddress}`} 
                                        onClick={()=> setOptionSelect([index + data.length, upHistory])}>{`${upHistory.date.getMonth() + 1}/${upHistory.date.getDate()} ~ ${upHistory.date.toLocaleString([], {hour: "2-digit", minute: "2-digit"})}`} </div>
                                    ))} 
                                </div>
                                }


                            </div>
                        </div>
                        {optionSelect[1].services == "Select Service" ?
                        <div className="container bg-secondary-subtle h-100 col-10">Select Service</div>
                        :
                        <div className="container h-100 col-10 ps-0">
                            {optionSelect[1].services.map((theService, index) => (
                                <div key = {[theService, index]} className=" bg-secondary-subtle final_result me-3 border border-5 border-white"> 
                                    <div className="d-flex justify-content-center align-items-center final_result_text"> 
                                        <h3 className="text-center fw-bold p-3 text-wrap">{theService.displayName.text}</h3>
                                    </div>
                                    <div className="d-flex justify-content-center"><img className="final_result_photo" src = {theService.photoURL} alt = "Service Photo"/></div>
                                    <div className="d-flex justify-content-center align-items-center p-3"> 
                                        <div className="text-center fs-4 text-wrap">{theService.formattedAddress}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        }
                    </div>
                    }

                </div>
            </div>
        )
    }
}