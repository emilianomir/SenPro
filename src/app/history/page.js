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
    const dummyData = [{date: new Date("2025-04-01"), name: "Bob's Burgers Chain"}, {date: new Date("2025-03-09"), name: "Wendy's"}, {date: new Date("2025-02-23"), name: 'Mall'}];
    let past_array =  [];
    let upcoming_array = [];

    /*
    dummyData.map((current)=>{
        if (current.date > current_date)
            upcoming_array.push(current);
        else 
            past_array.push(current);
    });
    */
    const {userEmail} = useAppContext();
    const [changed, setChanged] = useState([false, false]);
    const [collapse, setCollapse] = useState(null);
    const [data, setData] = useState([]); 
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [optionSelect, setOptionSelect] = useState([0, {services: "Select Service"}]);
    // if (userEmail === null)
    //     redirect("/login");

    useEffect(() => {
        const fetchInfo = async () => {
            try{
                const history = await selectHistory(userEmail[1]);
                setData(history)
                // history.map((current)=>{
                //     if (current.date >= current_date)
                //         upcoming_array.push(current);
                //     else {
                //         past_array.push(current);
                //     }
                // });
                // past_array = past_array.sort((a,b) => a.date-b.date);
                // console.log("PAST ARRAY")
                // console.log(past_array);
                // upcoming_array = upcoming_array.sort((a,b)=>a.date-b.date);
                // const group_past_array = [];
                // past_array.map((theCurrent) => {
                //     const monthAndDay = `${theCurrent.date.getMonth() + 1}/${theCurrent.date.getDate()}`;
                //     let arrayMonthAndDay;
                //     if (group_past_array.length > 0) {
                //         arrayMonthAndDay = `${group_past_array[group_past_array.length-1][0].date.getMonth() + 1}/${group_past_array[group_past_array.length-1][0].date.getDate()}`
                //     }
                //     if (group_past_array.length != 0 && monthAndDay == arrayMonthAndDay)
                //         group_past_array[group_past_array.length-1].push(theCurrent);
                //     else 
                //         group_past_array.push([theCurrent]);
                // })
                // console.log(group_past_array);
                } catch(error) {
                    console.error("Error fetching DB:", error);
                    alert("There was an issue getting the data.");
                } finally {
                    setLoading(false);
                }
            }
            fetchInfo();

        }, []);
    data.map((current)=>{
        if (current.date >= current_date)
            upcoming_array.push(current);
        else {
            past_array.push(current);
        }
    });

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
                                <div className="col bg-danger" onClick={() => setChanged([!changed[0], changed[1]])}>
                                    <p className="fw-bold fs-3 text-center">Past</p>
                                </div>
                                {changed[0] &&  
                                <div className="col p-0">
                                    {past_array.map((ptHistory, index) => (
                                        <div align = "left" className={` ${optionSelect[0] === index ? "d-flex p-1 bd-highlight bg-info" : " d-flex p-1 bd-highlight bg-white"} fs-4 text-end border border-2 pe-3`} key = {`${index}-${ptHistory.services.formattedAddress}`}
                                        onClick={()=>{setOptionSelect([index, ptHistory])}}> {`${ptHistory.date.getMonth() + 1}/${ptHistory.date.getDate()} ~ ${ptHistory.date.toLocaleString([], {hour: "2-digit", minute: "2-digit"})}`}
                                        </div>
                                    ))} 
                                </div> 
                                }
                                <div className="col bg-primary" onClick={() => setChanged([changed[0], !changed[1]])}>
                                    <p className="fw-bold fs-3 text-center">Today</p>
                                </div>
                                {changed[1] && 
                                <div className="col p-0">
                                {upcoming_array.map((upHistory, index) => (
                                        <div className={`${optionSelect[0] === index + past_array.length? "d-flex p-1 bd-highlight bg-info" : " d-flex p-1 bd-highlight bg-white"} fs-4 text-end border border-2 pe-3`} key = {`${index + past_array.length}-${upHistory.services.formattedAddress}`} 
                                        onClick={()=> setOptionSelect([index + past_array.length, upHistory])}>{`${upHistory.date.getMonth() + 1}/${upHistory.date.getDate()} ~ ${upHistory.date.toLocaleString([], {hour: "2-digit", minute: "2-digit"})}`} </div>
                                    ))} 
                                </div>
                                }


                            </div>
                        </div>
                        {optionSelect[1].services == "Select Service" ?
                        <div className="containter bg-secondary-subtle h-100 col-10">Select Service</div>
                        :
                        <div className="containter h-100 col-10">
                            {optionSelect[1].services.map((theService, index) => (
                                <div key = {[theService, index]} className=" bg-secondary-subtle final_result me-3 border border-5 border-white"> 
                                    <div className="d-flex justify-content-center align-items-center final_result_text"> 
                                        <h3 className="text-center fw-bold p-3 text-wrap">{theService.displayName.text}</h3>
                                    </div>
                                    <div className="d-flex justify-content-center"><img className="final_result_photo" src = {theService.photo_image} alt = "Service Photo"/></div>
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