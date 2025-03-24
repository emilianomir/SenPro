import { useAppContext } from "@/context"
import { useEffect, useState } from "react";
import Favorites_Section from "@/components/Favorites_Section";
import { useRouter } from "next/navigation";
import { Modal } from 'bootstrap';



export default function SelectFavorites({routingFunc}){
    const { favorites, setAPIServices, setResponses } = useAppContext();
    const router = useRouter();





    return (
        <div className="container">
            <div className="container">
            <button className='btn btn-primary w-25' data-bs-toggle="modal" data-bs-target="#reg-modal">View Favorites</button>
               
            </div>



        <div className="modal fade" id="reg-modal" tabIndex="-1" aria-labelledby="modal-title" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modal-title">Are you sure you want to continue?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <form >
                    <div className="modal-body">
                    <h6 className="modal-title" id="modal-title">Preview:</h6>
                    <Favorites_Section favoritesList={["Test"]}/>
                    </div>  
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={routingFunc}>Go To Favorites</button>
                    </div>
                    </form>

                </div>
            </div>
        </div>


        </div>


    
    )
}