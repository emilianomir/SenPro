"use client"
import "../css/question_page.css"
import Question from "@/components/Question";


import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context";
import { useState, useEffect } from "react";
import { addQuestion } from "@/components/DBactions";




function Questionaire({index = 1}){
    const {apiServices, setAPIServices} = useAppContext(); 
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState("Begin");
    const searchParams = useSearchParams();
    const userEmail = searchParams.get("user");

    useEffect(() => {
        console.log("curr routed user email:", userEmail);
    }, [userEmail]);


    const goToNext = ()=>{
        router.push(`/services?user=${userEmail}`);
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
        answer: [["Museum", "Price"], ["Gallery", "Price", "Art_Gallery"], ["Attractions", "AttractQ", "Cultural_Landmark"], 
        ["Entertainment", "ArtEntertaimentQ", "Performing_Arts_Theater"], ["No Preference", "Price"]]
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
        answer: [["Regular", "Price", "Cafe"], ["Cat", "Price"], ["Dog", "Price"], ["Internet", "Price"], ["No Preference", "Price"]]
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
         ["Japenese", "Price"], ["Chinese", "Price"], ["Korean", "Price"], ["Greek", "Price"]]}
    );
    questionsList.set("Price", {
        question: ["What is the average price range?", 3],
        answer: [["Inexpensive", "Rating"], ["Moderate", "Rating"], ["Expensive", "Rating"], ["Very_Expensive", "Rating"], ["No Preference", "Rating"]]
    })
    questionsList.set("Rating", {
        question: ["Preferred Rating?", 4],
        answer: [["3.0-", "End"], ["3.0+", "End"], ["3.5+", "End"], ["4.0+", "End"], ["No Preference", "End"]]
    })
    questionsList.set("End",{
        question: ["Loading", 6],
        answer: [] }
    );


    return (
        <div className="bg-secondary full_page">
            <div className="container">
                <div className="mb-5">
                    <h1 className="pt-5 title text-white fw-bold">Place {index}:</h1>
                </div>
            </div>
            <div className="container mt-4 mb-5">
                <div>
                    <div className="mb-4">
                        <Question theQuestion= {questionsList} current = {currentQuestion} func={goToNext} userEmail={userEmail}/>
                    </div>
                </div>
                <div className="text-center">
                    <div className="fs-3 text-white mb-3">Ready to search for places? Click here:</div>
                    <div className="w-100">
                        <button className="btn btn-primary w-25" type = "button">Done</button>
                    </div>
                </div>

            </div>

            <div className="container text-center">
                <div className="fs-4 text-white">Have a specific location in mind?</div>
                <div>
                    <form>
                        <input className="w-50"></input>
                        <button className="btn btn-primary" type= "button">Enter</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Questionaire; 
