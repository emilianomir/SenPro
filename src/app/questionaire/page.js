"use client"
import "../css/question_page.css"
import Question from "@/components/Question";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { useState } from "react";
import Loading from "@/components/Loading";


function Questionaire(){
  
    const {apiServices, setAPIServices, userServices, numberPlaces, setServices, setResponses, favorites, userResponses} = useAppContext(); 
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    if (numberPlaces < userServices.length + 1 && (userResponses.name ? userResponses.name: userResponses.main_category) != "Favorites"){ //reset the services list

        setServices([]);
        redirect("/start"); 
        return;
    }
    const goToNext = ()=>{
        if (apiServices)
            setAPIServices(null); //reset the copy of services for new services
        router.push("/services");
    }

    const fromFavorites = () =>{
        setResponses({name: "Favorites", main_category: "Favorites_List"});
        var favoritesList = [];
        favorites.forEach(element => {
            const val = JSON.parse(element.info);
            favoritesList.push(val);
            console.log(favoritesList)
        })
        setAPIServices(favoritesList);
    }
  

    const loading = () =>{
        setLoading(true);
    }



    const questionsList = new Map();
  
    questionsList.set("Begin",        
        { 
        question: ["What do you want to do?", 0], 
        answer: [["Food and Drink", "FoodDrink"], ["Arts", "ArtQ", "Culture"], ["Entertainment", "End", "Entertainment and Recreation"], ["Sports", "End"], ["Shopping", "End"], ["Services", "End"] ]}
    );
    questionsList.set("FoodDrink",{
        question: ["What type would you like?", 1],
        answer: [["Bar", "Price"], ["Restaurant", "Rest"], ["Cafe", "CafeQ"]]
    });
    questionsList.set("ArtQ", {
        question: ["What type of culture and arts would you like?", 1],
        answer: [["Museum", "Price"], ["Gallery", "Price", "Art_Gallery"], ["Attractions", "AttractQ", "No Change"], 
        ["Entertainment", "ArtEntertaimentQ", "No Change"], ["No Preference", "Price"]]
    });
    questionsList.set("AttractQ", {
        question: ["What type of attractions would you like?", 1],
        answer: [["Landmark", "Price", "Cultural_Landmark"], ["Historical Place", "Price", "Historical_Place"], ["Monument", "Price"]]
    });
    questionsList.set("ArtEntertaimentQ", {
        question: ["What type of entertainment would you like?", 1],
        answer: [["Theater", "Price", "Performing_Arts_Theater"], ["Auditorium", "Price"], ["Art Studio", "Price", "Art_Studio"]]
    });
    questionsList.set("CafeQ", {
        question: ["What type of cafe would you like?", 1],
        answer: [["Regular", "Price", "No Change"], ["Cat", "Price"], ["Dog", "Price"], ["Internet", "Price"], ["No Preference", "Price"]]
    });    
    questionsList.set("MovieQ", {
        question: ["What company do you want?", 5], 
        answer: [["Cinemark", "End"], ["AMC", "End"], ["No Preference", "End"]]}
    );
    questionsList.set("Rest", {
        question: ["What experience would you like?", 2 ], 
        answer: [["Fast Food", "FoodTQ"], ["Dining", "FoodTQ"], ["Fine Dining", "FoodTQ"], ["No Preference", "FoodTQ"]]}
    );
    questionsList.set("FoodTQ", {
        question: ["What food would you like?", 1], 
        answer: [["American", "Price"], ["Asian", "Price"], ["Indian", "Price"], ["Mexican", "Price"], ["Italian", "Price"],
         ["Japanese", "Price"], ["Chinese", "Price"], ["Korean", "Price"], ["Greek", "Price"]]}
    );
    questionsList.set("Price", {
        question: ["What is the average price range?", 3],
        answer: [["Inexpensive", "Rating"], ["Moderate", "Rating"], ["Expensive", "Rating"], ["Very_Expensive", "Rating"], ["No Preference", "Rating"]]
    })
    questionsList.set("Rating", {
        question: ["Preferred Rating?", 4],
        answer: [["2.0+", "End"], ["3.0+", "End"], ["3.5+", "End"], ["4.0+", "End"], ["No Preference", "End"]]
    })
    questionsList.set("End",{
        question: ["Loading", 6],
        answer: [] }
    );

    return (
        <div className="bg-secondary full_page">
            {isLoading ? <Loading message= "Saving Responses"/>: 
            <>
                <div className="container">
                    <div className="mb-5">
                        <h1 className="pt-5 title text-white fw-bold">Place {userServices.length + 1}:</h1>
                    </div>
                </div>
                <Question theQuestion= {questionsList} current = {"Begin"} func={goToNext} changeLoading={loading} favFunc={fromFavorites} />
            </>
        }
        </div>  

        
    )
}

export default Questionaire; 