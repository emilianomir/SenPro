"use client"
import { useEffect, useState } from "react";
import { addFavoriteService, checkFavoriteService, removeFavoriteService } from "./DBactions";
import { useAppContext } from "@/context";


function Favorites({service, responses}){
    const {userEmail, favorites, setFavorites} = useAppContext();
    const [sVal, setSearch] = useState(userEmail[1]);
    // Stars
    const [star, setStar] = useState(true);
    const [info, setInfo] = useState(service);
    const [response, setResponses] = useState(responses);
    const [loading, setLoading] = useState(true);

    function changeStar()
    {
        setStar(!star);
        
        checkFavoriteService(service.id, sVal).then((data) => {
          if (data) {
            addFavoriteService(info.id, JSON.stringify(response), sVal);
            setFavorites(favorites ? [...favorites, service]: [service]);
          }

        });

        if (!star)
        {
            checkFavoriteService(service.id, sVal).then((data) => {
                if (!data){    
                    removeFavoriteService(info.id, sVal);
                    let removeFavArray = favorites.filter(theFav => theFav.id != service.id);
                    setFavorites(removeFavArray)
                }
            });
        }
    }

    /*
    function initialStar()
    {
        checkFavoriteService(service.id, sVal).then((data) => {
            if (!data)
                setStar(false);
          });
    }
          */

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                if(!(await checkFavoriteService(service.id, sVal)))
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

        <button className={`px-3 py-1 ml-1 mt-1 rounded ${star ? "outline-2 outline-white hover:bg-blue-400/70" : "bg-blue-600 hover:bg-blue-400"} ` } onClick={changeStar}>
        ★
        </button>

        );
}

export default Favorites;