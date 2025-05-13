const API_VALID_TYPES = {
    car_dealer: true,
    car_rental: true,
    car_repair: true,
    car_wash: true,
    electric_vehicle_charging_station: true,
    gas_station: true,
    parking: true,
    rest_stop: true,
    corporate_office: true,
    farm: true,
    ranch: true,
    art_gallery: true,
    art_studio: true,
    auditorium: true,
    cultural_landmark: true,
    historical_place: true,
    monument: true,
    museum: true,
    performing_arts_theater: true,
    sculpture: true,
    library: true,
    preschool: true,
    primary_school: true,
    school: true,
    secondary_school: true,
    university: true,
    adventure_sports_center: true,
    amphitheatre: true,
    amusement_center: true,
    amusement_park: true,
    aquarium: true,
    banquet_hall: true,
    barbecue_area: true,
    botanical_garden: true,
    bowling_alley: true,
    casino: true,
    childrens_camp: true,
    comedy_club: true,
    community_center: true,
    concert_hall: true,
    convention_center: true,
    cultural_center: true,
    cycling_park: true,
    dance_hall: true,
    dog_park: true,
    event_venue: true,
    ferris_wheel: true,
    garden: true,
    hiking_area: true,
    historical_landmark: true,
    internet_cafe: true,
    karaoke: true,
    marina: true,
    movie_rental: true,
    movie_theater: true,
    national_park: true,
    night_club: true,
    observation_deck: true,
    off_roading_area: true,
    opera_house: true,
    park: true,
    philharmonic_hall: true,
    picnic_ground: true,
    planetarium: true,
    plaza: true,
    roller_coaster: true,
    skateboard_park: true,
    state_park: true,
    tourist_attraction: true,
    video_arcade: true,
    visitor_center: true,
    water_park: true,
    wedding_venue: true,
    wildlife_park: true,
    wildlife_refuge: true,
    zoo: true,
    public_bath: true,
    public_bathroom: true,
    stable: true,
    accounting: true,
    atm: true,
    bank: true,
    acai_shop: true,
    afghani_restaurant: true,
    african_restaurant: true,
    american_restaurant: true,
    asian_restaurant: true,
    bagel_shop: true,
    bakery: true,
    bar: true,
    bar_and_grill: true,
    barbecue_restaurant: true,
    brazilian_restaurant: true,
    breakfast_restaurant: true,
    brunch_restaurant: true,
    buffet_restaurant: true,
    cafe: true,
    cafeteria: true,
    candy_store: true,
    cat_cafe: true,
    chinese_restaurant: true,
    chocolate_factory: true,
    chocolate_shop: true,
    coffee_shop: true,
    confectionery: true,
    deli: true,
    dessert_restaurant: true,
    dessert_shop: true,
    diner: true,
    dog_cafe: true,
    donut_shop: true,
    fast_food_restaurant: true,
    fine_dining_restaurant: true,
    food_court: true,
    french_restaurant: true,
    greek_restaurant: true,
    hamburger_restaurant: true,
    ice_cream_shop: true,
    indian_restaurant: true,
    indonesian_restaurant: true,
    italian_restaurant: true,
    japanese_restaurant: true,
    juice_shop: true,
    korean_restaurant: true,
    lebanese_restaurant: true,
    meal_delivery: true,
    meal_takeaway: true,
    mediterranean_restaurant: true,
    mexican_restaurant: true,
    middle_eastern_restaurant: true,
    pizza_restaurant: true,
    pub: true,
    ramen_restaurant: true,
    restaurant: true,
    sandwich_shop: true,
    seafood_restaurant: true,
    spanish_restaurant: true,
    steak_house: true,
    sushi_restaurant: true,
    tea_house: true,
    thai_restaurant: true,
    turkish_restaurant: true,
    vegan_restaurant: true,
    vegetarian_restaurant: true,
    vietnamese_restaurant: true,
    wine_bar: true,
    administrative_area_level_1: true,
    administrative_area_level_2: true,
    country: true,
    locality: true,
    postal_code: true,
    school_district: true,
    city_hall: true,
    courthouse: true,
    embassy: true,
    fire_station: true,
    government_office: true,
    local_government_office: true,
    neighborhood_police_station: true,
    police: true,
    post_office: true,
    chiropractor: true,
    dental_clinic: true,
    dentist: true,
    doctor: true,
    drugstore: true,
    hospital: true,
    massage: true,
    medical_lab: true,
    pharmacy: true,
    physiotherapist: true,
    sauna: true,
    skin_care_clinic: true,
    spa: true,
    tanning_studio: true,
    wellness_center: true,
    yoga_studio: true,
    apartment_building: true,
    apartment_complex: true,
    condominium_complex: true,
    housing_complex: true,
    bed_and_breakfast: true,
    budget_japanese_inn: true,
    campground: true,
    camping_cabin: true,
    cottage: true,
    extended_stay_hotel: true,
    farmstay: true,
    guest_house: true,
    hostel: true,
    hotel: true,
    inn: true,
    japanese_inn: true,
    lodging: true,
    mobile_home_park: true,
    motel: true,
    private_guest_room: true,
    resort_hotel: true,
    rv_park: true,
    beach: true,
    church: true,
    hindu_temple: true,
    mosque: true,
    synagogue: true,
    astrologer: true,
    barber_shop: true,
    beautician: true,
    beauty_salon: true,
    body_art_service: true,
    catering_service: true,
    cemetery: true,
    child_care_agency: true,
    consultant: true,
    courier_service: true,
    electrician: true,
    florist: true,
    food_delivery: true,
    foot_care: true,
    funeral_home: true,
    hair_care: true,
    hair_salon: true,
    insurance_agency: true,
    laundry: true,
    lawyer: true,
    locksmith: true,
    makeup_artist: true,
    moving_company: true,
    nail_salon: true,
    painter: true,
    plumber: true,
    psychic: true,
    real_estate_agency: true,
    roofing_contractor: true,
    storage: true,
    summer_camp_organizer: true,
    tailor: true,
    telecommunications_service_provider: true,
    tour_agency: true,
    tourist_information_center: true,
    travel_agency: true,
    veterinary_care: true,
    asian_grocery_store: true,
    auto_parts_store: true,
    bicycle_store: true,
    book_store: true,
    butcher_shop: true,
    cell_phone_store: true,
    clothing_store: true,
    convenience_store: true,
    department_store: true,
    discount_store: true,
    electronics_store: true,
    food_store: true,
    furniture_store: true,
    gift_shop: true,
    grocery_store: true,
    hardware_store: true,
    home_goods_store: true,
    home_improvement_store: true,
    jewelry_store: true,
    liquor_store: true,
    market: true,
    pet_store: true,
    shoe_store: true,
    shopping_mall: true,
    sporting_goods_store: true,
    store: true,
    supermarket: true,
    warehouse_store: true,
    wholesaler: true,
    arena: true,
    athletic_field: true,
    fishing_charter: true,
    fishing_pond: true,
    fitness_center: true,
    golf_course: true,
    gym: true,
    ice_skating_rink: true,
    playground: true,
    ski_resort: true,
    sports_activity_location: true,
    sports_club: true,
    sports_coaching: true,
    sports_complex: true,
    stadium: true,
    swimming_pool: true,
    airport: true,
    airstrip: true,
    bus_station: true,
    bus_stop: true,
    ferry_terminal: true,
    heliport: true,
    international_airport: true,
    light_rail_station: true,
    park_and_ride: true,
    subway_station: true,
    taxi_stand: true,
    train_station: true,
    transit_depot: true,
    transit_station: true,
    truck_stop: true
  };
  



const questionsList = new Map();
  
//Start Question
questionsList.set("Begin", { 
    question: ["What do you want to do?", 0], 
    answer: [["Beach", "End"], ["Food and Drink", "FoodDrink"], ["Arts", "ArtQ", "Culture"], ["Entertainment", "EntertainQ", "Entertainment and Recreation"], ["Sports", "SportsQ"], ["Shopping", "ShoppingQ"], ["Services", "ServicesQ"] ]}
);

//Food Category Questions
questionsList.set("FoodDrink",{
    question: ["What type would you like?", 1],
    answer: [["Bar", "BarQ", [3]], ["Restaurant", "SpecificTypes", [3]], ["Cafe", "CafeQ", [3]], ["Food Shop", "FoodShopQ", [0]]]
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
    answer: [["Fast Food", "Price", [1]], ["Fine Dining", "Price", [1]], ["No Preference", "Price"]]
});

questionsList.set("CafeQ", {
    question: ["What type of cafe would you like?", 1],
    answer: [["Regular", "Price", [0]], ["Cat", "Price" , [1]], ["Dog", "Price" , [1]], ["Internet", "Price" , [1]], ["No Preference", "Price" , [1]]]
});    
questionsList.set("FoodShopQ", {
    question: ["What type of shop would you like?", 1],
    answer: [["Bagel Shop", "Price", [1]], ["Chocolate Shop", "Price" , [1]], ["Coffee Shop", "Price" , [1]], ["Dessert Shop", "Price" , [1]], ["Donut Shop", "Price" , [1]], ["Ice Cream Shop", "Price" , [1]], 
    ["Juice Shop", "Price" , [1]], ["Sandwich Shop", "Price" , [1]], ["No Preference", "Price" , [0]]]
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
    answer: [["Regular", "Rating", [0]], ["Amusement Park", "Rating", [2, "Amusement"]], ["Dog Park", "Rating", [2, "Dog"]], ["National Park", "Rating", [2, "National"]],
    ["Picnic", "Rating", [3, "Picnic Ground"]], ["Skateboard", "Rating", [2]], ["State Park", "Rating", [2, "State"]], ["Water Park", "Rating", [2, "Water"]], ["Wildlife Park", "Rating", [2, "Wildlife"]], ["No Preference", "Rating"]]
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

class Responses {
    constructor() {
      this.main_category = null;
      this.types = null;
      this.priceLevel = null;
      this.rating = null;
      this.name = null;
      this.textQuery = null;
      this.fuel_type = null;
    }
  }

//const current = "Begin";
// const prevKeys = [];
const prevValues = [];
// const theQuestion = questionsList;


function gotoPrev() {
    if (prevKeys.length === 0) //this means we are at the first question, leave
        return;
    const previousResponses = prevKeys[prevKeys.length-1]; //this is an array of tuples. It holds the previous question key to go back as well as the user selected option
    const prevQuestion = theQuestion.get(previousResponses[0]); //gets the values from hash map with the previous key
    // console.log("prevValues: "); //debugging
    // console.log(prevValues);
    const theUserResponsesAPI = prevValues[prevValues.length-1]; //this is an array of arrays that records user respones that deals with API calls.
    if (previousResponses[1] != "No Preference") { //the values did not change
        switch (prevQuestion.question[1]){ //this is the grouping
            case 0: //if we are here, that means it the first question, which means full reset
                obj.main_category = theUserResponsesAPI[0]; //these would be null
                obj.textQuery = theUserResponsesAPI[1];
                prevValues.pop();
                break;
            case 1: 
                if (obj.types != theUserResponsesAPI[0])
                    obj.types = theUserResponsesAPI[0]

                if (obj.textQuery != theUserResponsesAPI[1])
                    obj.textQuery = theUserResponsesAPI[1];
                prevValues.pop();
                break;

            case 2: 
                if (obj.types != theUserResponsesAPI[0])
                    obj.types = theUserResponsesAPI[0]
                if (obj.textQuery != theUserResponsesAPI[1])
                    obj.textQuery = theUserResponsesAPI[1]
                prevValues.pop();
                break;
            case 3: //this is an easy reset
                obj.priceLevel = null;
                break;

            case 5: //no case 4 since at the moment, it goes instantly after choosing rating
                obj.name = null;
                break;

            case 6: //for the fuel question
                obj.fuel_type = null; 

        }
    }
    // changeDes(previousResponses[0]); 
    // prevKeys.pop();
    // if (prevKeys.length == 0)
    //     setSearchP(false); //hides the text
}


function destValue(obj, valueSelect, currentKey, apiValue){
    const copy_obj = {...obj};
    // if (destSelect == current){ //to show text
    //     setSearchP(true);
    // }
    if (valueSelect != "No Preference") { //we do not need to change or update values if no preference
        switch (questionsList.get(currentKey).question[1]){ //looks at the grouping index
            case 0:
                prevValues.push([copy_obj.main_category, copy_obj.textQuery]); //stores the previous values before change
                copy_obj.main_category = valueSelect; 
                copy_obj.textQuery = valueSelect;
                break;
            case 1: //this focuses on types changes and sometimes textQuery
                let temp = null;
                prevValues.push([copy_obj.types, copy_obj.textQuery]); //we push the previous values first
                
                //always choosing the api value to be passed to object, otherwise if there is no API value, that means the value selected is the same as API value
                //Ex: Value: "Arts", API value: "Culture". If apiValue == "" that means apiValue is the valueSelect, ex: Value: "Mexican" API value = "mexican"
                

                /* 
                For the following two sections, I made another addtional grouping to make it easier to change to the types and textQueries.

                    Note: For both cases, I checked to see if I have an api value. 
                    The api value could be a tuple. That means that the string in index 1 is the string required for places API (it would cause a bad request since Places API needs the string to be exact)
                    So say I have [4, "Outdoors Vehicles Store"]. The string shown to the user would be "Outdoors" but in reality the string that should be passed to 
                    API should be outdoors_vehicles_store. The number at index 0 is the grouping
                   


                    For Case 1 (types changing), the grouping is as follows:
                        0: If we see a 0, that means we should not make any changes to existing object
                        1: This means we want to just concatenate the incoming values to the beginning of both types and textQuery if applicable (the types might be null, so we just set the types to be incoming)
                        2: This means we want to concatenate the incoming value to the types, but then change the textQuery to be the same as newly created type
                        3: This means we want to completely replace the existing types and textQuery properties with the incoming values
                        4: This means we do not want to mess with the existing type value, but want to make completely change the textQuery
                        5: This means we want to completely replace the types with incoming value, but concatenate to the textQuery

                    Example:
                    Say we are in following question: ["What type of food store are you looking for?", 1]
                    And user selects this answer: ["Food Store", "Price", [2, "Food"]]
                           Think of it like this: [What user sees, Map Key, [#, apiTextValue]]
                    The existing type property is "store" and textQuery is "Food Retail Stores"
                    Here we go to case 1 and then subgrouping 2.
                    Since the subgrouping is 2, that means the we would need to add to existing type. Using the same approach as above for api value,
                    the new type should be "food_store". The textQuery would then be replaced with the newly created type, without the '_'
                    Therefore, the textQuery would be 'food store' (does not matter if lowercase or uppercase, Google would still search either)


                    For Case 2 (textQuery), the grouping is as follows:
                        0 or "": Same as before, don't change anything
                        1: We only want to replace the types property. Majority of the time it is null
                        2: This only concatenate the incoming value with the existing textQuery if applicable
                        3: This changes both the types and textQuery. We completely replace the types with incoming value and then set the textQuery with the newly changed type.
                        4: Adds to beginning of the types string.
                */

                if (apiValue[0] != 0) { //0 would mean ignore
                    let actualAPIvalue;
                    if (apiValue[1])
                        actualAPIvalue = apiValue[1];
                    temp = actualAPIvalue? actualAPIvalue.toLowerCase(): valueSelect.toLowerCase();
                    switch (apiValue[0]) {
                        case 1:
                            temp = temp.replaceAll(" ", "_");
                            copy_obj.types = copy_obj.types? `${temp}_${copy_obj.types}`: copy_obj.types = temp;
                            copy_obj.textQuery = `${valueSelect} ${copy_obj.textQuery}`;
                            break;

                        case 2:
                            temp = temp.replaceAll(" ", "_");
                            copy_obj.types = copy_obj.types? `${temp}_${copy_obj.types}`: copy_obj.types = temp;
                            copy_obj.textQuery = copy_obj.types.replaceAll("_", " ");
                            break;

                        case 3:
                            temp = temp.replaceAll(" ", "_");
                            copy_obj.types = temp;
                            copy_obj.textQuery = valueSelect;
                            break;
                        
                        case 4:
                           copy_obj.textQuery = temp;
                           break

                        case 5:
                            temp = temp.replaceAll(" ", "_");
                            copy_obj.types = temp;
                            copy_obj.textQuery = `${valueSelect} ${copy_obj.textQuery}`;
                            break;
                    }
   
                }
                break;
            case 2:
                prevValues.push([copy_obj.types, copy_obj.textQuery]);
                if (apiValue[0] == 1) {
                    let temp;
                    if (apiValue[1]) {
                        temp = apiValue[1].toLowerCase();
                        temp = temp.replaceAll(" ", "_");
                    }
                    else if (valueSelect.includes(" ")) {
                        temp = valueSelect.replaceAll(" ", "_");
                    }
                    copy_obj.types = temp ? temp: valueSelect.toLowerCase();
                }

                else if (apiValue[0] == 2) {  //this only changes the text query
                    let realValue;
                    if (apiValue[1]) {
                        realValue = apiValue[1];
                        realValue.includes(copy_obj.textQuery) ? realValue = realValue.replace(" " + copy_obj.textQuery, ""): null;
                    }
                    else if (valueSelect.includes(copy_obj.textQuery)){
                        realValue = valueSelect.replace(" " + copy_obj.textQuery, "");
                    }
                    copy_obj.textQuery ? copy_obj.textQuery =  `${realValue ? realValue: valueSelect} ${copy_obj.textQuery}`: copy_obj.textQuery = realValue? realValue : valueSelect;  
                }

                else if (apiValue[0] == 3){
                    let temp;
                    if (apiValue[1]) {
                        temp = apiValue[1].toLowerCase();
                        temp = temp.replaceAll(" ", "_");
                    }
                    else if (valueSelect.includes(" ")) {
                        temp = valueSelect.replaceAll(" ", "_").toLowerCase();
                    }
                    copy_obj.types = temp ? temp: valueSelect.toLowerCase();
                    copy_obj.textQuery =  copy_obj.types.replaceAll("_", " ");
                }
                else if (apiValue[0] == 4) {
                    let temp;
                    if (apiValue[1]) {
                        temp = apiValue[1].toLowerCase();
                        temp = temp.replaceAll(" ", "_");
                    }
                    else if (valueSelect.includes(" ")) {
                        temp = valueSelect.replaceAll(" ", "_").toLowerCase();
                    }
                    copy_obj.types? `${temp}_${copy_obj.types}`: copy_obj.types = temp;
                    copy_obj.textQuery =  copy_obj.types.replaceAll("_", " ");
                }
                    
                break;
            case 3:
                copy_obj.priceLevel = "PRICE_LEVEL_"+ valueSelect.toUpperCase();
                break;
            case 4: 
                const theNumber = valueSelect.split(/[+-]/); //regex to get the number seperated from plus or minus symbol
                copy_obj.rating = Number(theNumber[0]);
                break;
            case 5:
                copy_obj.name = valueSelect; 
                break;
            case 6:
                copy_obj.fuel_type = valueSelect.replaceAll(" ", "_");
        }   
    }

    // console.log("prevValues: "); //debugging
    // console.log(prevValues);
    // prevKeys.push([destSelect, valueSelect]);
  
    // if (userEmail != null) {
    //     try {
    //         const exists = await testExistingUser(userEmail[1]);
    //         if (exists) {
    //             await addQuestion(userEmail[1], ques.question[0], valueSelect);
    //         } else {
    //             console.error("user doesnt exist in db:", userEmail[1]);
    //         }
    //     } catch (e) {
    //         console.error("error storing question and answer:", e);
    //     }
    // }

    return copy_obj;
}

function checkRepeats(str) {
    const words = str.toLowerCase().split(' ');
    const unique = {}
    const duplicates = {}
    for (let i = 0; i < words.length; i ++) {
        if (unique[words[i]] && !duplicates[words[i]])
            duplicates[words[i]] = true
        else 
            unique[words[i]] = true;
    }

    return duplicates;

}


function checkKeys(hash, key){ //would either return 
    if (key == "End") //base case
        return true;
    const currentLoc = hash.get(key);
    if (!currentLoc) //this means that there is a key that leads to nowhere
        return key;
    else if (currentLoc.question.length != 2 || !(Number.isInteger(currentLoc.question[1])) || !(currentLoc.question[1] <= 6)) //this means it is missing a grouping or is a number that does not have a case in logic
        return [key, currentLoc.question];
    else 
    {
        let valid;
        for (let i = 0; i < currentLoc.answer.length; i ++){
            valid = checkKeys(hash, currentLoc.answer[i][1]) //recursion
            if (valid != true)
                return valid;
        }
        return valid;
    }
}



function checkObjectForward(hash, key, theObject, response = null, apiValue = null, futurekey){
    if (response == "Beach" || key == "End" || key == "Rating" || key == "Price")
        return true;
    let current = {...theObject};
    if (response && apiValue) {
        current = destValue(current, response, key, apiValue);
        if (current.types && !API_VALID_TYPES[current.types]) { //checks to see if the types are valid baaed on API list
            return [current, response];
        }
        if (current.textQuery) { //checks to see if there are no repeats
            let hasRepeats = checkRepeats(current.textQuery);
            if (Object.keys(hasRepeats).length != 0)
                return [current, key, hasRepeats];
        }

    }
    let valid;
    if (!futurekey)
        futurekey = key;
    let hash_obj = hash.get(futurekey);
    for (let i = 0; i < hash_obj.answer.length; i ++){
        valid = checkObjectForward(hash, futurekey, current, hash_obj.answer[i][0], hash_obj.answer[i][2] ? hash_obj.answer[i][2] : "", hash_obj.answer[i][1]);
        if (valid != true)
            return valid;
    }
    return valid;
    
}

describe("Question List", () =>{
    it ('it has a map with 45 questions' ,() => {
        expect(questionsList.size).toEqual(45);
    });

    it ('map has all valid keys and have numbering from 0-6', ()=> {
        expect(checkKeys(questionsList, "Begin")).toBe(true)
    });

    it ('Begin should have 0 numbering', ()=> {
        expect(questionsList.get("Begin").question[1]).toEqual(0);
    });

    it ('Price should have 3 numbering', ()=> {
        expect(questionsList.get("Price").question[1]).toEqual(3);
    });

    it ('Rating should have 4 numbering', ()=> {
        expect(questionsList.get("Rating").question[1]).toEqual(4);
    });
    
    it ('Fuel should have 6 numbering', ()=> {
        expect(questionsList.get("FuelQ").question[1]).toEqual(6);
    });
})

describe("API Object", ()=> {
    it("has valid API types and no duplicates words in text query", () => {
        expect(checkObjectForward(questionsList, "Begin", new Responses())).toBe(true);
    })

    it("API object is valid after random choices and stopping randomly", () => {
        let theKey = "Begin";
        let choices_key = "Begin"
        let objArray  = questionsList.get(choices_key);
        let choices_index = Math.floor(Math.random() * (objArray.answer.length-1)) + 1;
        const choices = [objArray.answer[choices_index][0]];
        let stop;
        while (objArray.answer[choices_index][1] != "End") {
            stop = Math.floor(Math.random() * 4);
            if (stop == 0 && choices.length > 1)
                break;
            choices_key = objArray.answer[choices_index][1];
            objArray = questionsList.get(choices_key);
            choices_index = Math.floor(Math.random() * (objArray.answer.length-1)) + 1;
            choices.push(objArray.answer[choices_index][0]);
        }
        console.log(choices)
        let choice_obj = new Responses();
        let index = 0;

        let currentMap = questionsList.get(theKey);
        for (let i = 0; i < choices.length; i ++){
            currentMap = questionsList.get(theKey);
            index = currentMap.answer.findIndex(element => element[0] == choices[i] );
            if (choices[i] == "No Preference"){  //makes sure no change occured
                let copy = {...choice_obj}
                choice_obj = destValue(choice_obj, choices[i], theKey, currentMap.answer[index][2] ? currentMap.answer[index][2]: "");
                expect(copy).toEqual(choice_obj);
            }
            else 
                choice_obj = destValue(choice_obj, choices[i], theKey, currentMap.answer[index][2] ? currentMap.answer[index][2]: "");
            if (choice_obj.types) //makes sure that it would caused an error for API
                expect(API_VALID_TYPES[choice_obj.types]).toBe(true);
            if (choice_obj.rating) //has correct rating
                expect(choice_obj.rating).toBe(Number((choices[choices.length-1].split(/[+-]/)[0])));
            expect(Object.keys(checkRepeats(choice_obj.textQuery)).length).toBe(0);
            theKey = currentMap.answer[index][1];
        }
        console.log(choice_obj)
    })
})



