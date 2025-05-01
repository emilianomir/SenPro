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
        
        <div className="bg-gradient-to-br from-black-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 active:bg-blue-700" onClick={changeStar}>
        <button type="button" className={"btn " + (star ? "btn-outline-info" : "btn-info" )}>
        <svg className={star? "w-4 h-4 text-gray-200 dark:text-gray-600":"w-4 h-4 text-yellow-300"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
        </svg> 
        </button>
        </div>
        

        );
}

export default Favorites;