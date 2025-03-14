"use client"
import { useEffect, useState } from "react";
import { addFavoriteService, checkFavoriteService, removeFavoriteService } from "./DBactions";
import { useAppContext } from "@/context";


function Favorites({service}){
    const {userEmail} = useAppContext();
    const [sVal, setSearch] = useState(userEmail[1]);
    // Stars
    const [star, setStar] = useState(true);
    const [info, setInfo] = useState(service);
    const [loading, setLoading] = useState(true);

    function changeStar()
    {
        setStar(!star);
        
        checkFavoriteService(service.formattedAddress, sVal).then((data) => {
          if (data)
            addFavoriteService(info.formattedAddress, info, sVal);
        });

        if (!star)
        {
            checkFavoriteService(service.formattedAddress, sVal).then((data) => {
                if (!data)
                    removeFavoriteService(info.formattedAddress, sVal);
            });
        }
    }

    /*
    function initialStar()
    {
        checkFavoriteService(service.formattedAddress, sVal).then((data) => {
            if (!data)
                setStar(false);
          });
    }
          */

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                if(!(await checkFavoriteService(service.formattedAddress, sVal)))
                    setStar(false);
            } catch(error) {
                console.error("Error fetching DB:", error);
                alert("There was an issue getting the data.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);


    
    if(loading)
        return <p>loading...</p>

    return (

        <button type="button" className={"btn " + (star ? "btn-outline-info" : "btn-info" )} onClick={changeStar}>
        ★
        </button>

        );
}

export default Favorites;