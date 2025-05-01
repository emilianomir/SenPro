"use client"
import Question from "@/components/Question";
import { redirect, useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { createStatelessQ, getInfoSession, deleteSession, getUserSession, getFavAPI} from "@/components/DBactions";
import { ConsoleLogWriter } from "drizzle-orm";


function Questionaire(){
  
    const {apiServices, setAPIServices, userServices, numberPlaces, setNumberPlaces, setServices, setResponses, favorites, setFavorites, userResponses, setUserEmail, userEmail} = useAppContext(); 
    const [isLoading, setLoading] = useState(false);
    const [isSessionLoading, setSessionLoad] = useState(true);
    const [yes, setyes] = useState(true);
    const [callAPI, setcallAPI] = useState(false);
    const router = useRouter();

    // if (numberPlaces < userServices.length + 1 && (userResponses.name ? userResponses.name: userResponses.main_category) != "Favorites"){ //reset the services list
    //     setServices([]);
    //     redirect("/start")
    // }
    // if (numberPlaces == 0) { //this means the user has not entered the number of places
    //     redirect("/login"); 
    // }


    useEffect(()=> {
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
                if (services_result) {
                    for (let i of services_result) {
                        if (i.photos) {
                            const result = await fetch('/api/maps/places?thePhoto=' + i.photos[0].name);
                            if (result.ok) {
                                const photoURL= result;
                                i.photo_image = photoURL.url;
                            }
                               
                            // await new Promise(resolve => setTimeout(resolve, 100));
                        }
    
                    }
                }
                /*
                console.log("Service result in services page: "); //debugging purposes
                console.log(services_result);
                */
                // if (change){
                setAPIServices(services_result);
                router.push("/services");
                    // }


                
            }catch (error) {
                console.error("Error fetching API:", error);
                alert("There was an issue getting the data.");
            }
        }
        if (callAPI)
            getInfo();
        else {
            document.body.classList.add('overflow-hidden');
        }
        // So it does not prevent other pages scrolling
        return () => {
          document.body.classList.remove('overflow-hidden');
        };
        // console.log("The apiServices: ") //debugging
        // console.log(apiServices);
    }, [callAPI]);


    // Gets the session
    useEffect(() => {
        const fetchProducts = async () => {
            if (yes){
            try{
                setyes(false);
                let userName = await getUserSession();
                if (userName != null) {
                    setUserEmail([userName[0].username, userName[0].email]);
                    if(!favorites){
                        const favoritesList = await getFavAPI(userName[0].email);
                        if(favoritesList) setFavorites(favoritesList);
                    }
                }
                let sessionValues = null;
                if (numberPlaces <= 0) sessionValues = await getInfoSession();
                if(sessionValues == null || numberPlaces > 0)
                {
                    
                    if(numberPlaces > 0) await deleteSession('Qsession');
                    let email = "HASHTHIS";
                    if(userName)
                    {
                        email = userName[0].email;
                    }
                    await createStatelessQ(numberPlaces, userServices, [], [], email);
                }
                else
                {
                    setNumberPlaces(sessionValues.numberPlaces);
                    setServices(sessionValues.userServices);
                }


            } catch(error) {
                console.error("Error fetching DB:", error);
                alert("There was an issue getting the data.");
            } finally {
                setSessionLoad(false);
            }
            }
        }
        fetchProducts();
        }, [yes]);


    // const goToNext = ()=>{
    //     if (apiServices)
    //         setAPIServices(null); //reset the copy of services for new services
    //     router.push("/services");
    // }

    const goToNext = () => {
        setcallAPI(true);
    }


    // const fromFavorites = () =>{
    //     setResponses({name: "Favorites", main_category: "Favorites_List"});
    //     var favoritesList = [];
    //     favorites.forEach(element => {
    //         const val = JSON.parse(element.info);
    //         favoritesList.push(val);
    //         console.log(favoritesList)
    //     })
    //     setAPIServices(favoritesList);
    // }
  

    const loading = () =>{
        setLoading(true);
    }

    const questionsList = new Map();
  
    //Start Question
    questionsList.set("Begin", { 
        question: ["What do you want to do?", 0], 
        answer: [["Beach", "End"], ["Food and Drink", "FoodDrink"], ["Arts", "ArtQ", "Culture"], ["Entertainment", "EntertainQ", "Entertainment and Recreation"], ["Sports", "SportsQ"], ["Shopping", "ShoppingQ"], ["Services", "ServicesQ"] ]}
    );

    //Food Category Questions
    questionsList.set("FoodDrink",{
        question: ["What type would you like?", 1],
        answer: [["Bar", "BarQ", [3]], ["Restaurant", "SpecificTypes", [3]], ["Cafe", "CafeQ", [3]], ["Food Shop", "FoodShopQ", [3, "Shop"]]]
    });
    questionsList.set("BarQ", {
        question: ["What type of bar would you like?", 1],
        answer: [["Bar and Grill", "Price", [3]], ["Public Bar", "Price" , [3, "pub"]], ["Wine", "Price" , [1]], ["No Preference", "Price" , [1]]]
    });   
    questionsList.set("SpecificTypes", {
        question: ["What type of food are you craving?", 2 ], 
        answer: [["Culture", "FoodTQ", [2]], ["Meal-Specific", "FoodMeal", [2]], ["General", "GeneralFood", [0]], ["No Preference", "Price"]]
    });

    //Restaurant SubQuestions:
    questionsList.set("FoodTQ", {
        question: ["What cultural food would you like?", 1], 
        answer: [["African" , "Rest", [2]],["American", "Rest", [2]], ["Asian", "Rest", [2]], ["Indian", "Rest", [2]], ["Mexican", "Rest" , [2]], ["Italian", "Rest" , [2]],
            ["Japanese", "Rest" , [2]], ["Chinese", "Rest" , [2]], ["Korean", "Rest" , [2]], ["Greek", "Rest" , [2]]]}
    );
    questionsList.set("Rest", {
        question: ["What experience would you like?", 2 ], 
        answer: [["Fast Food", "Price", [2]], ["Dining", "Price", [2]], ["Fine Dining", "Price", [2]], ["No Preference", "Price"]]}
    );
    questionsList.set("FoodMeal", {
        question: ["Choose a meal you would like ", 1 ], 
        answer: [["Barbeque", "Price", [2, "Barbecue"]], ["Breakfast", "Price", [2]], ["Brunch", "Price", [2]], ["Dessert", "Price", [2]], 
        ["Hamburger", "Price", [2]], ["Pizza", "Price", [2]], ["Ramen", "Price", [2]], ["Seafood", "Price", [2]], ["Steak", "Price", [3, "Steak House"]],  ["Sushi", "Price", [2]], ["Vegan", "Price", [2]], ["Vegetarian", "Price", [2]], ["No Preference", "Price"]]}
    );
    questionsList.set("GeneralFood", {
        question: ["What experience would you like?", 1 ], 
        answer: [["Fast Food", "Price", [1]], ["Dining", "Price", [1]], ["Fine Dining", "Price", [1]], ["No Preference", "Price"]]
    });

    questionsList.set("CafeQ", {
        question: ["What type of cafe would you like?", 1],
        answer: [["Regular", "Price", [0]], ["Cat", "Price" , [1]], ["Dog", "Price" , [1]], ["Internet", "Price" , [1]], ["No Preference", "Price" , [1]]]
    });    
    questionsList.set("FoodShopQ", {
        question: ["What type of shop would you like?", 1],
        answer: [["Bagel", "Price", [1]], ["Chocolate", "Price" , [1]], ["Coffee", "Price" , [1]], ["Dessert", "Price" , [1]], ["Donut", "Price" , [1]], ["Ice Cream", "Price" , [1]], 
        ["Juice", "Price" , [1]], ["Sandwich", "Price" , [1]], ["No Preference", "Price" , [0]]]
    }); 



    //Art Questions
    questionsList.set("ArtQ", {
        question: ["What type of culture and arts would you like?", 2],
        answer: [["Attractions", "AttractQ", [2]], ["Entertainment", "ArtEntertaimentQ", [2]], ["No Preference", "Rating"]]
    });
    questionsList.set("AttractQ", {
        question: ["What type of attractions would you like?", 1],
        answer: [["Museum", "Rating", [3]], ["Gallery", "Rating", [3, "Art_Gallery"]] ,["Landmark", "Rating", [3, "Cultural_Landmark"]], ["Historical Place", "Rating", [3]], ["Monument", "Rating", [3]]]
    });
    questionsList.set("ArtEntertaimentQ", {
        question: ["What type of entertainment would you like?", 1],
        answer: [["Museum", "Rating", [3]], ["Gallery", "Rating", [3, "Art_Gallery"]], ["Theater", "Rating", [3, "Performing Arts Theater"]], ["Auditorium", "Rating", [3]], ["Art Studio", "Rating",  [3]]]
    });



    //Entertainment Questions
    questionsList.set("EntertainQ",{
        question: ["What catgory of entertainment would you like?", 2],
        answer: [["Adventure/Outdoors", "OutdoorsQ", [2]], ["Amusements", "AmuseQ", [2]], ["Performance", "PerfQ", [2]], ["Social Activities", "SocialQ", [2]], ["Tourism", "TourQ", [2]], 
    ["NightLife", "NightQ", [2]], ["No Preference", "Rating"]]
    });
    questionsList.set("OutdoorsQ",{
        question: ["What type of outdoor/adventure place are you looking for?", 1],
        answer: [["Adventure Sports Center", "Rating", [3]], ["Park", "ParkQ", [3]], ["Hiking", "Rating", [3, "Hiking Area"]], ["Marina/Dock", "Rating", [3, "Marina"]],
        ["Observation Deck", "Rating", [3]], ["Plaza", "Rating", [3]], ["No Preference", "Rating"]]
    });

    //Park SubQuestion
    questionsList.set("ParkQ",{
        question: ["What type of park are you looking for?", 1],
        answer: [["Regular", "Rating", [0]], ["Amusement Park", "Rating", [1, "Amusement"]], ["Dog Park", "Rating", [1, "Dog"]], ["National Park", "Rating", [1, "National"]],
        ["Picnic", "Rating", [3, "Picnic Ground"]], ["Skateboard", "Rating", [1, "Skateboard"]], ["State Park", "Rating", [1, "State"]], ["Water Park", "Rating", [1, "Water"]], ["Wildlife Park", "Rating", [1, "Wildlife Park"]], ["No Preference", "Rating"]]
    });

    questionsList.set("AmuseQ", {
        question: ["What type of amusements are you looking for?", 1],
        answer: [["Amusement Center", "Rating", [3]], ["Amusement Park", "Rating", [3]], ["Aquarium", "Rating", [3]], ["Bowling Alley", "Rating", [3]], 
        ["Dance Hall", "Rating", [3]], ["Planetarium", "Rating", [3]], ["Skateboard Park", "Rating", [3]], ["Video Arcade", "Rating", [3]], ["Water Park", "Rating", [3]], ["Zoo", "Rating", [3]]]
    });
    questionsList.set("PerfQ", {
        question: ["What type of performance are you looking for?", 1],
        answer: [["Comedy Club", "Rating", [3]], ["Concert Hall", "Rating", [3]],  ["Movies", "Rating", [3, "Movie Theater"]], ["Opera House", "Rating", [3]]]
    });
    questionsList.set("SocialQ",{
        question: ["What type of social place are you looking for?", 1],
        answer: [["Bowling Alley", "Rating", [3]], ["Community Center", "Rating", [3]], ["Cultural Center", "Rating", [3]], ["Movies", "Rating", [3, "Movie Theater"]], ["Philharmonic Hall", "Rating", [3]], ["No Preference", "Rating"]]
    });
    questionsList.set("TourQ", {
        question: ["What type of touring sites are you looking for?", 1],
        answer: [["Amusement Park", "Rating", [3]], ["Aquarium", "Rating", [3]], ["Historical Landmark", "Rating", [3]], ["National Park", "Rating", [3]], ["Tourist Attraction", "Rating", [3]], 
    ["Visitor Center", "Rating", [3]], ["Zoo", "Rating", [3]]]
    });
    questionsList.set("NightQ", {
        question: ["Select a nightlife place?", 1],
        answer: [["Casino", "Rating", [3]], ["Night Club", "Rating", [3]], ["No Preference", "Rating"]]
    });



    //Sports Questions
    questionsList.set("SportsQ",{
        question: ["Select a sport service", 2],
        answer: [["Fishing", "FishQ", [2]], ["Fitness", "FitQ", [2]], ["Activities", "ActQ", [2]], ["No Preference", "Rating"]]
    });
    questionsList.set("FishQ",{
        question: ["Select where you would like to fish", 1],
        answer: [["Charter", "Rating", [3, "Fishing Charter"]], ["Pond", "Rating", [3, "Fishing_Pond"]]]
    });
    questionsList.set("FitQ",{
        question: ["Select a fitness option", 1],
        answer: [["Field", "Rating", [3, "Athletic Field"]], ["Fitness Center", "Rating", [3]], ["Gym", "Rating", [3]], ["Sports Complex", "Rating", [3]]]
    });
    questionsList.set("ActQ",{
        question: ["Select an activity", 1],
        answer: [["Golf", "Rating", [3, "Golf Course"]], ["Ice Skating", "Rating", [3, "Ice Skating Rink"]], ["Playground", "Rating", [3]], ["Ski Resort", "Rating", [3]], ["Sports Club", "Rating", [3]],
    ["Stadium", "Rating", [3]], ["Swimming", "Rating", [3,"Swimming Pool"]]]
    });
 


    //Shopping Questions
    questionsList.set("ShoppingQ", {
        question: ["What type of shops are you looking for?", 1],
        answer: [["Retail Stores", "RetQ", [3, "Store"]], ["Food Retail Stores", "FoodRetQ", [3, "Store"]], ["Mall", "Price", [3, "Shopping Mall"]]]
    });
    questionsList.set("RetQ", {
        question: ["What category of retail store are you looking for?", 2],
        answer: [["Vehicle", "VecQ", [2]], ["Electronics", "ElectQ", [4]], ["Home", "HomeQ", [2]], ["Clothing and Goods", "ClothQ", [2]], ["Pet Store", "Price", [3]], ["Variety", "VaryQ", [2]]]
    });

    //Retail Store SubQuestions
    questionsList.set("VecQ", {
        question: ["What type of vehicle store are you looking for?", 1],
        answer: [["Auto Parts", "Price", [2]], ["Bicycle", "Price", [2]], ["Outdoor", "Price", [4, "Outdoors Vehicles Store"]]]
    });
    questionsList.set("ElectQ", {
        question: ["What type of a electronic store are you looking for?", 1],
        answer: [["General", "Price", [0]], ["Cell Phone", "Price", [3, "Cell Phone Store"]]]
    });
    questionsList.set("HomeQ", {
        question: ["What type of a home store are you looking for?", 1],
        answer: [["Home Goods", "Price", [2]], ["Furniture", "Price", [2]], ["Home Improvement", "Price", [2]]]
    });
    questionsList.set("ClothQ", {
        question: ["What type of a clothes or goods store are you looking for?", 1],
        answer: [["Book Store", "Price", [2, "Book"]], ["Clothing", "Price", [2]], ["Department", "Price", [2]], ["Gift Shop", "Price", [3]], ["Hardware", "Price", [2]], ["Home Goods", "Price", [2]],
    ["Jewelry", "Price", [2]], ["Shoes", "Price", [2, "Shoe"]]]
    });
    questionsList.set("VaryQ", {
        question: ["What type of store are you looking for?", 1],
        answer:  [["Department", "Price", [2] ], ["Market", "Price", [3]], ["Supermarket", "Price", [3]], ["Wholesaler", "Price", [3]], ["No Preference", "Price"]]
    });

    questionsList.set("FoodRetQ", {
        question: ["What type of food store are you looking for?", 1],
        answer: [["Asian Grocery Store", "Price", [2, "Asian Grocery"]], ["Butcher", "Price", [3, "Butcher Shop"]], ["Convenience", "Price", [2]], ["Food Store", "Price", [2, "Food"]], ["Grocery", "Price", [2]], ["Liquor", "Price", [2]],
    ["Market", "Price", [3]], ["Supermarket", "Price", [3]], ["Wholesaler", "Price", [3]], ["No Preference", "Price"]]
    });

    //Services Questions
    questionsList.set("ServicesQ", {
        question: ["What type of service would you like?", 2],
        answer: [["Automotive", "AutoQ", [2]], ["Bank", "BankQ", [2]], ["Hair Services", "HairQ", [2]], ["Tours Services", "ToursQ", [2]], 
        ["Beauty Services", "BeautyQ", [2]], ["Contractors Services", "ContQ", [2]]]
    });
    questionsList.set("AutoQ", {
        question: ["What type of automotive services would you like?", 1],
        answer: [["Car Wash", "Price", [3]], ["Car Dealership", "Price" , [3, "Car_Dealer"]], ["Car Repair", "Price" , [3]], ["Car Rental", "Price" , [3]], ["Gas Station", "GasQ" , [3]]]
    });   

    //Gas Station SubQuestion
    questionsList.set("GasQ", {
        question: ["What type of station do would you like?", 1],
        answer: [["Gas", "FuelQ", [0]], ["Electric Vehicle Charger", "Rating" , [3, "Electric Vehicle Charging Station"]]]
    });  

    //Fuel SubQuestion
    questionsList.set("FuelQ", {
        question: ["What type of fuel do you use?", 6],
        answer: [["PREMIUM", "Rating"], ["MIDGRADE", "Rating"], ["REGULAR UNLEADED", "Rating"], ["DIESEL", "Rating"], ["E85", "Rating"]]
    });  

    questionsList.set("BankQ", {
        question: ["What type of bank would you like?", 1],
        answer: [["Accounting", "Price", [3]], ["Bank", "Rating", [3]], ["ATM", "Rating" , [3]]]
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
    questionsList.set("ContQ", {
        question: ["Which contractors are you looking for?", 1],
        answer: [["Electrician", "Price", [3]], ["Funeral Home", "Price" , [3]], ["Lawyer", "Price", [3]], ["Moving", "Price", [3, "Moving Company"]], ["Painter", "Price", [3]], ["Plumber", "Price", [3]],
    ["Real Estate", "Price", [3, "Real Estate Agency"]], ["Roofing", "Price", [3, "Roofing Contractor"]], ["Traveling", "Price", [3, "Travel Agency"]]]
    });  
 


    questionsList.set("Price", {
        question: ["What is the average price range?", 3],
        answer: [["Inexpensive", "Rating"], ["Moderate", "Rating"], ["Expensive", "Rating"], ["Very_Expensive", "Rating"], ["No Preference", "Rating"]]
    });
    questionsList.set("Rating", {
        question: ["Preferred Rating?", 4],
        answer: [["2.0+", "End"], ["3.0+", "End"], ["3.5+", "End"], ["4.0+", "End"], ["No Preference", "End"]]
    });
    questionsList.set("End",{
        question: ["Loading"],
        answer: [] }
    );




    // if(isSessionLoading){
    //     return (<Loading message= "Fetching Session"/>)
    // }
    return (
        <div>
            {isLoading ? <Loading message= "Fetching Services Based On Responses"/>: 
            <>
                <div className="relative h-screen bg-[url(https://images.alphacoders.com/674/674925.png)] bg-cover bg-black/500" />
                <div className="absolute top-0 left-0 h-full w-full bg-slate-800/90" />
              
                <div className="absolute top-0 left-0 h-screen w-full">
                    <h1 className="pt-5 pl-5 underline text-5xl text-white font-bold">Place {userServices.length + 1}:</h1>  
                    <Question className = "" theQuestion= {questionsList} current = {"Begin"} func={goToNext} changeLoading={loading}  />
                </div>

            </>

            


        }
        </div>  

        
    )
}

export default Questionaire; 