"use client"
import { useAppContext } from "@/context"
import { redirect } from "next/navigation";
import RouteButton from "@/components/route_button";
import { useState } from "react";

export default function History(){
    const current_date = new Date();
    const dummyData = [{date: new Date("2025-04-01"), name: "Bob's Burgers Chain"}, {date: new Date("2025-03-09"), name: "Wendy's"}, {date: new Date("2025-02-23"), name: 'Mall'}];
    let past_array =  [];
    let upcoming_array = [];

    dummyData.map((current)=>{
        if (current.date > current_date)
            upcoming_array.push(current);
        else 
            past_array.push(current);
    });
    past_array = past_array.sort((a,b) => a.date-b.date);
    upcoming_array = upcoming_array.sort((a,b)=>a.date-b.date);
    const {userEmail} = useAppContext();
    const [changed, setChanged] = useState([true, false]); 
    const [optionSelect, setOptionSelect] = useState([0, past_array[0]]); 
    if (userEmail === null)
        redirect("/login");
    return( 
        <div className="container w-100 vh-100 mt-4">
            <h1 className="text-center text-white fs-1 fw-bolder">History</h1> 
            <div className="d-flex justify-content-center w-100 h-100 mt-4">
                {dummyData.length === 0 ?   
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
                                    <div className={` ${optionSelect[0] === index ? "bg-info" : "bg-white"} fs-4 text-end border border-2 pe-3`} key = {`${index}-${ptHistory.name}`}
                                    onClick={()=>{setOptionSelect([index, ptHistory])}}> {`${ptHistory.date.getMonth() + 1}/${ptHistory.date.getDate()}`}
                                    </div>
                                ))} 
                            </div> 
                            }
                            <div className="col bg-primary" onClick={() => setChanged([changed[0], !changed[1]])}>
                                <p className="fw-bold fs-3 text-center">Upcoming</p>
                            </div>
                            {changed[1] && 
                            <div className="col p-0">
                               {upcoming_array.map((upHistory, index) => (
                                    <div className={`${optionSelect[0] === index + past_array.length? "bg-info" : "bg-white"} fs-4 text-end border border-2 pe-3`} key = {`${index + past_array.length}-${upHistory.name}`} 
                                    onClick={()=> setOptionSelect([index + past_array.length, upHistory])}>{`${upHistory.date.getMonth() + 1}/${upHistory.date.getDate()}`} </div>
                                ))} 
                            </div>
                            }

                        </div>
                    </div>
                    <div className="containter bg-secondary-subtle h-100 col-10">
                        <div className="text-center">{optionSelect[1].name}</div>
                    </div>
                </div>
                }

            </div>
        </div>
    )

    
}