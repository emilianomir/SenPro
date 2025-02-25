"use client"
import "../css/question_page.css"
import Question from "@/components/Question";
import { useRouter } from "next/navigation";



function Questionaire({index = 1}){
    const router = useRouter();
    const goToNext = ()=>{
        router.push("/services");
    } 

    const questionsList = new Map();
  
    questionsList.set("Begin",        
        { 
        question: "What do you want to do?", 
        answer: [["Movies", "MovieQ"], ["Food", "FoodQ"], ["Park", "End"], ["Gym", "End"], ["Sports", "End"] ]}
    );
    questionsList.set("MovieQ", {
        question: "What company do you want?", 
        answer: [["Cinemark", "End"], ["AMC", "End"], ["No Preference", "End"]]}
    );
    questionsList.set("FoodQ", {
        question: "What experience would you like?", 
        answer: [["Fast Food", "FoodTQ"], ["Dining", "FoodTQ"], ["No Preference", "FoodTQ"]]}
    );
    questionsList.set("FoodTQ", {
        question: "What food would you like?", 
        answer: [["Asian", "End"], ["Indian", "End"], ["Mexican", "End"], ["Italian", "End"]]}
    );
    questionsList.set("End",{
        question: "Thats all folks!",
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
                        <Question theQuestion= {questionsList} current = {"Begin"} func={goToNext}/>
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
