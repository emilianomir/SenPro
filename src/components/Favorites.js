"use client"
import { useEffect, useState } from "react";
import { addFavoriteService, checkService, removeFavoriteService } from "./DBactions";
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
        
        checkService(service.formattedAddress).then((data) => {
          if (data)
            addFavoriteService(info.formattedAddress, info, sVal);
        });

        if (!star)
        {
            checkService(service.formattedAddress).then((data) => {
                if (!data)
                    removeFavoriteService(info.formattedAddress, sVal);
            });
        }
    }

    function initialStar()
    {
        checkService(service.formattedAddress).then((data) => {
            if (!data)
                setStar(false);
          });
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                if(!(await checkService(info.formattedAddress)))
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