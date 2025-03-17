"use client"
import "../css/question_page.css"
import Question from "@/components/Question";
import { redirect, useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";


function Questionaire(){
  
    const {apiServices, setAPIServices, userResponses, userServices, numberPlaces, setServices} = useAppContext(); 
    const [isLoading, setLoading] = useState(false);
    const [callAPI, setcallAPI] = useState(false);
    const router = useRouter();

    // if (numberPlaces != 0 && numberPlaces < userServices.length + 1){ //reset the services list
    //     setServices([]);
    //     redirect("/start")
    // }
    // if (numberPlaces == 0) { //this means the user has not entered the number of places
    //     redirect("/login"); 
    // }

    
    useEffect(()=> {
        // let change = true;

        const getInfo = async ()=> {
            try {
                const response = await fetch('/api/maps/places', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({userResponses})
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const {services_result} = await response.json();
                console.log("Service result in services page: "); //debugging purposes
                console.log(services_result);
                // if (change){
                    setAPIServices(services_result);
                    router.push("/services");
                    // }


                
        
            }catch (error) {
                console.error("Error fetching API:", error);
                alert("There was an issue getting the data.");
            }
        }
        // if (!apiServices) //if we already have services from previous call, don't make a new call
        //     {
        if (callAPI)
            getInfo();
            // }
        console.log("The apiServices: ") //debugging
        console.log(apiServices);
        // return () => {
        //     change = false;
        //     };
    }, [callAPI]);

    // const goToNext = ()=>{
    //     if (apiServices)
    //         setAPIServices(null); //reset the copy of services for new services
    //     router.push("/services");
    // }
    const goToNext = () => {
        setcallAPI(true);
    }


    const loading = () =>{
        setLoading(true);
    }



    const questionsList = new Map();
  
    questionsList.set("Begin", { 
        question: ["What do you want to do?", 0], 
        answer: [["Beach", "End"], ["Food and Drink", "FoodDrink"], ["Arts", "ArtQ", "Culture"], ["Entertainment", "EntertainQ", "Entertainment and Recreation"], ["Sports", "SportsQ"], ["Shopping", "ShoppingQ"], ["Services", "ServicesQ"] ]}
    );
    questionsList.set("FoodDrink",{
        question: ["What type would you like?", 1],
        answer: [["Bar", "BarQ", [3]], ["Restaurant", "SpecificTypes", [3]], ["Cafe", "CafeQ", [3]], ["Food Shop", "FoodShopQ", [3, "Shop"]]]
    });
    questionsList.set("ArtQ", {
        question: ["What type of culture and arts would you like?", 1],
        answer: [["Museum", "Price", [3]], ["Gallery", "Price", [3, "Art_Gallery"]], ["Attractions", "AttractQ", [4]], 
        ["Entertainment", "ArtEntertaimentQ", [4]], ["No Preference", "Price", [0]]]
    });
    questionsList.set("EntertainQ",{
        question: ["What catgory of entertainment would you like?", 2],
        answer: [["Adventure/Outdoors", "OutdoorsQ"], ["Amusements", "AmuseQ"], ["Performance", "PerfQ"], ["Social Activities", "SocialQ"], ["Tourism", "TourQ"], 
    ["NightLife", "NightQ"], ["No Preference", "Price"]]
    });
    questionsList.set("OutdoorsQ",{
        question: ["What type of outdoor/adventure place are you looking for?", 1],
        answer: [["Adventure Sports Center", "Price", [3]], ["Park", "ParkQ", [3]], ["Hiking", "Price", [3, "Hiking Area"]], ["Marina/Dock", "Price", [3, "Marina"]],
        ["Observation Deck", "Price", [3]], ["Plaza", "Price"], ["No Preference", "Price"]]
    });
    questionsList.set("AmuseQ", {
        question: ["What type of amusements are you looking for?", 1],
        answer: [["Amusement Center", "Price", [3]], ["Amusement Park", "Price", [3]], ["Aquarium", "Price", [3]], ["Bowling Alley", "Price", [3]], 
        ["Dance Hall", "Price", [3]], ["Planetarium", "Price", [3]], ["Skateboard Park", "Price", [3]] ["Video Arcade", "Price", [3]], ["Water Park", "Price", [3]], ["Zoo", "Price", [3]]]
    });
    questionsList.set("PerfQ", {
        question: ["What type of performance are you looking for?", 1],
        answer: [["Comedy Club", "Price", [3]], ["Concert Hall", "Price", [3]],  ["Movies", "Price", [3, "Movie Theater"]], ["Opera House", "Price", [3]], []]
    });
    questionsList.set("SocialQ",{
        question: ["What type of social place are you looking for?", 2],
        answer: [["Bowling Alley", "Price", [3]], ["Community Center", "Price", [3]], ["Cultural Center", "Price", [3]], ["Movies", "Price", [3, "Movies Theater"]], ["Philharmonic Hall", "Price", [3]], ["No Preference", "Price"]]
    });
    questionsList.set("TourQ", {
        question: ["What type of touring sites are you looking for?", 1],
        answer: [["Amusement Park", "Price", [3]], ["Aquarium", "Price", [3]], ["Historical Landmark", "Price", [3]], ["National Park", "Price", [3]], ["Tourist Attraction", "Price", [3]], 
    ["Visitor Center", "Price", [3]], ["Zoo", "Price", [3]]]
    });
    questionsList.set("NightQ", {
        question: ["Select a nightlife place?", 1],
        answer: [["Casino", "Price", [3]], ["Night Club", "Price", [3]], ["No Preference", "Price"]]
    });
    questionsList.set("ParkQ",{
        question: ["What type of park are you looking for?", 1],
        answer: [["Regular", "Price", [0]], ["Amusement Park", "Price", [1, "Amusement"]], ["Dog Park", "Price", [1, "Dog"]], ["National Park", "Price", [1, "National"]],
        ["Picnic", "Price", [3, "Picnic Ground"]], ["Skateboard", "Price", [1, "Skateboard"]], ["State Park", "Price", [1, "State"]], ["Water Park", "Price", [1, "Water"]], ["Wildlife Park", "Price", [1, "Wildlife Park"]], ["No Preference", "Price"]]
    });
    questionsList.set("ServicesQ", {
        question: ["What type of service would you like?", 2],
        answer: [["Automotive", "AutoQ"], ["Bank", "BankQ"], ["Hair Services", "HairQ"], ["Tours Services", "ToursQ"], 
        ["Beauty Services", "BeautyQ"], ["Contractors Services", "ContQ"]]
    });
    questionsList.set("ShoppingQ", {
        question: ["What type of shops are you looking for?", 1],
        answer: [["Retail Stores", "RetQ", [3, "Store"]], ["Food Retail Stores", "FoodRetQ", [3, "Store"]], ["Mall", "Price", [3, "Shopping Mall"]]]
    });
    questionsList.set("SportsQ",{
        question: ["Select a sport service", 2],
        answer: [["Fishing", "FishQ"], ["Fitness", "FitQ"], ["Activities", "ActQ"], ["No Preference", "Price"]]
    });
    questionsList.set("RetQ", {
        question: ["What category of retail store are you looking for?", 2],
        answer: [["Vehicle", "VecQ"], ["Electronics", "ElectQ"], ["Home", "HomeQ"], ["Clothing and Goods", "ClothQ"], ["Pet Store", "Price", [1, "Pet_Store"]], ["Variety", "VaryQ", [0]]]
    });
    questionsList.set("FoodRetQ", {
        question: ["What type of food store are you looking for?", 1],
        answer: [["Asian Grocery Store", "Price", [1, "Asian Grocery"]], ["Butcher", "Price", [3, "Butcher Shop"]], ["Convenience", "Price", [1]], ["Food Store", "Price", [1, "Food"]], ["Grocery", "Price", [1]], ["Liquor", "Price", [1]],
    ["Market", "Price", [3]], ["Supermarket", "Price", [3]], ["Wholesaler", "Price", [3]], ["No Preference", "Price"]]
    });
    questionsList.set("VecQ", {
        question: ["What type of vehicle store are you looking for?", 1],
        answer: [["Auto Parts", "Price", [1]], ["Bicycle", "Price", [1]], ["Outdoor", "Price", [1, "Sports_Goods"]]]
    });
    questionsList.set("ElectQ", {
        question: ["What type of a electronic store are you looking for?", 1],
        answer: [["General", "Price", [1, "Electronics"]], ["Cell Phone", "Price", [1]]]
    });
    questionsList.set("HomeQ", {
        question: ["What type of a home store are you looking for?", 1],
        answer: [["Home Goods", "Price", [1]], ["Furniture", "Price", [1]], ["Home Improvement", "Price", [1]]]
    });
    questionsList.set("ClothQ", {
        question: ["What type of a clothes or goods store are you looking for?", 1],
        answer: [["Book Store", "Price", [1, "Book"]], ["Clothing", "Price", [1]], ["Department", "Price", [1]], ["Gift Shop", "Price", [3]], ["Hardware", "Price", [1]], ["Home Goods", "Price", [1]],
    ["Jewelry", "Price", [1]], ["Shoes", "Price", [1, "Shoe"]]]
    });
    questionsList.set("VaryQ", {
        question: ["What type of store are you looking for?", 1],
        answer:  [["Department", "Price", [1] ]["Market", "Price", [3]], ["Supermarket", "Price", [3]], ["Wholesaler", "Price", [3]], ["No Preference", "Price"]]
    });
    questionsList.set("FishQ",{
        question: ["Select where you would like to fish", 1],
        answer: [["Charter", "Price", [3, "Fishing Charter"]], ["Pond", "Rating", [3, "Fishing_Pond"]]]
    });
    questionsList.set("FitQ",{
        question: ["Select a fitness option", 1],
        answer: [["Field", "Price", [3, "Athletic Field"]], ["Fitness Center", "Price", [3]], ["Gym", "Price", [3]], ["Sports Complex", "Rating", [3]]]
    });
    questionsList.set("ActQ",{
        question: ["Select an activity", 1],
        answer: [["Golf", "Price", [3, "Golf Course"]], ["Ice Skating", "Price", [3, "Ice Skating Rink"]], ["Playground", "Rating", [3]], ["Ski Resort", "Price", [3]], ["Sports Club", "Price", [3]],
    ["Stadium", "Price", [3]], ["Swimming", "Price", [3,"Swimming Pool"]]]
    });
    questionsList.set("AttractQ", {
        question: ["What type of attractions would you like?", 1],
        answer: [["Landmark", "Price", [3, "Cultural_Landmark"]], ["Historical Place", "Price", [3]], ["Monument", "Price", [3]]]
    });
    questionsList.set("ArtEntertaimentQ", {
        question: ["What type of entertainment would you like?", 1],
        answer: [["Theater", "Price", [3, "Performing Arts Theater"]], ["Auditorium", "Price", [3]], ["Art Studio", "Price",  [3]]]
    });
    questionsList.set("BarQ", {
        question: ["What type of bar would you like?", 1],
        answer: [["Bar and Grill", "Price", [3]], ["Public Bar", "Price" , [3, "pub"]], ["Wine", "Price" , [1]], ["No Preference", "Price" , [1]]]
    });   
    questionsList.set("CafeQ", {
        question: ["What type of cafe would you like?", 1],
        answer: [["Regular", "Price", [0]], ["Cat", "Price" , [1]], ["Dog", "Price" , [1]], ["Internet", "Price" , [1]], ["No Preference", "Price" , [1]]]
    });    
    questionsList.set("AutoQ", {
        question: ["What type of automotive services would you like?", 1],
        answer: [["Car Wash", "Price", [3]], ["Car Dealership", "Price" , [3, "Car_Dealer"]], ["Car Repair", "Price" , [3]], ["Car Rental", "Price" , [3]], ["Gas Station", "GasQ" , [4]]]
    });   
    questionsList.set("GasQ", {
        question: ["What type of station do would you like?", 1],
        answer: [["Gas Station", "Price", [3]], ["Electric", "Price" , [3, "Electric Vehicle Charging Station"]]]
    });   
    questionsList.set("BankQ", {
        question: ["What type of bank would you like?", 1],
        answer: [["Accounting", "Price", [3]], ["Bank", "Rating", [3]], ["ATM", "Rating" , [3]]]
    });   
    questionsList.set("ContQ", {
        question: ["Which contractors are you looking for?", 1],
        answer: [["Electrician", "Price", [3]], ["Funeral Home", "Price" , [3]], ["Lawyer", "Price", [3]], ["Moving", "Price", [3, "Moving Company"]], ["Painter", "Price", [3]], ["Plumber", "Price", [3]],
    ["Real Estate", "Price", [3, "Real Estate Agency"]], ["Roofing", "Price", [3, "Roofing Contractor"]], ["Traveling", "Price", [3, "Travel Agency"]]]
    });  
    questionsList.set("HairQ", {
        question: ["What type of hair service would you like?", 1],
        answer: [["Barber Shop", "Price", [3]], ["Hair Care", "Price", [3]], ["Hair Salon", "Price" , [3]]]
    });  
    questionsList.set("ToursQ", {
        question: ["What type of tour service would you like?", 1],
        answer: [["Tour Agency", "Price", [3]], ["Tourists Info Center", "Price", [3, "Tourist Information Center"]]]
    });   
    questionsList.set("BeautyQ", {
        question: ["Which type of beauty service would you like?", 1],
        answer: [["Beauty Salon", "Price", [3]], ["Beautician", "Price", [3]], ["Foot Care", "Price" , [3]], ["Makeup Artist", "Price", [3]], ["Nail Salon", "Price", [3]]]
    });    
    questionsList.set("FoodShopQ", {
        question: ["What type of shop would you like?", 1],
        answer: [["Bagel", "Price", [1]], ["Chocolate", "Price" , [1]], ["Coffee", "Price" , [1]], ["Dessert", "Price" , [1]], ["Donut", "Price" , [1]], ["Ice Cream", "Price" , [1]], 
        ["Juice", "Price" , [1]], ["Sandwich", "Price" , [1]], ["No Preference", "Price" , [0]]]
    });    
    questionsList.set("MovieQ", {
        question: ["What company do you want?", 5], 
        answer: [["Cinemark", "End"], ["AMC", "End"], ["No Preference", "End"]]}
    );
    questionsList.set("Rest", {
        question: ["What experience would you like?", 2 ], 
        answer: [["Fast Food", "Price"], ["Dining", "Price"], ["Fine Dining", "Price"], ["No Preference", "Price"]]}
    );
    questionsList.set("SpecificTypes", {
        question: ["What type of food are you craving?", 2 ], 
        answer: [["Culture", "FoodTQ", [0]], ["Meal-Specific", "FoodMeal", [0]], ["General", "GeneralFood", [0]], ["No Preference", "Price"]]
    });
    questionsList.set("GeneralFood", {
        question: ["What experience would you like?", 1 ], 
        answer: [["Fast Food", "Price", [1]], ["Dining", "Price", [1]], ["Fine Dining", "Price", [1]], ["No Preference", "Price"]]
    });
    questionsList.set("FoodMeal", {
        question: ["Choose a meal you would like ", 1 ], 
        answer: [["Barbeque", "Price", [1]], ["Breakfast", "Price", [1]], ["Brunch", "Price", [1]], ["Dessert", "Price", [1]], 
        ["Hamburger", "Price", [1]], ["Pizza", "Price", [1]], ["Ramen", "Price", [1]], ["Seafood", "Price", [1]], ["Steak", "Price", [5, "Steak House"]],  ["Sushi", "Price", [1]], ["Vegan", "Price", [1]], ["Vegetarian", "Price", [1]], ["No Preference", "Price"]]}
    );
    questionsList.set("FoodTQ", {
        question: ["What cultural food would you like?", 1], 
        answer: [["African" , "Rest", [1]],["American", "Rest", [1]], ["Asian", "Rest", [1]], ["Indian", "Rest", [1]], ["Mexican", "Rest" , [1]], ["Italian", "Rest" , [1]],
         ["Japanese", "Rest" , [1]], ["Chinese", "Rest" , [1]], ["Korean", "Rest" , [1]], ["Greek", "Rest" , [1]]]}
    );
    questionsList.set("Price", {
        question: ["What is the average price range?", 3],
        answer: [["Inexpensive", "Rating"], ["Moderate", "Rating"], ["Expensive", "Rating"], ["Very_Expensive", "Rating"], ["No Preference", "Rating"]]
    });
    questionsList.set("Rating", {
        question: ["Preferred Rating?", 4],
        answer: [["2.0+", "End"], ["3.0+", "End"], ["3.5+", "End"], ["4.0+", "End"], ["No Preference", "End"]]
    });
    questionsList.set("End",{
        question: ["Loading", 6],
        answer: [] }
    );


    return (
        <div className="bg-secondary full_page">
            {isLoading ? <Loading message= "Fetching Services Based On Responses"/>: 
            <>
                <div className="container">
                    <div className="mb-5">
                        <h1 className="pt-5 title text-white fw-bold">Place {userServices.length + 1}:</h1>
                    </div>
                </div>
                <Question theQuestion= {questionsList} current = {"Begin"} func={goToNext} changeLoading={loading} />
            </>
        }
        </div>
    )
}

export default Questionaire; 