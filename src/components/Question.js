import { useState, useEffect } from "react";
import { useAppContext } from "@/context";
//import { testExistingUser, addQuestion, getUser } from "./DBactions";
import { useSearchParams } from "next/navigation";
import SelectFavorites from "@/components/SelectFavorites";
import Favorites_Section from "./Favorites_Section";


//object to help with Places API calls
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
//General search is how I refer to skipping some parts of questionnaire and only responding to current responses 
function Question({theQuestion, current, func, changeLoading}){
    console.log("Question ran")
    const [start, SetStart] = useState(false);
    const {setResponses, userEmail} = useAppContext();  //used to pass the respones of the user to other pages (mainly services menu page)
    const [destSelect, changeDes] = useState("Begin"); //destination for map purposes
    const [prevKeys] = useState([]); //will store the map key and the user selected values as the user goes through questions
    const [prevValues] = useState([]); //an array of arrays that will store in following order: types, textQuery values
    const ques = theQuestion.get(destSelect); //this is how each question is rendered each time
    const [finished, setFinished] = useState(false); //used to make sure that all values are updated before moving to next page
    const [theTest, setTheTest] = useState(new Responses()); //the created object for API calls
    const [generalSearchP, setSearchP] = useState(false); //to show and hide the section for general searching
    const [readyGeneralSearch, setGeneralSearch] = useState(false); //to know when a user is ready to search for a services via general search 

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
                    theTest.main_category = theUserResponsesAPI[0]; //these would be null
                    theTest.textQuery = theUserResponsesAPI[1];
                    prevValues.pop();
                    break;
                case 1: 
                    if (theTest.types != theUserResponsesAPI[0])
                        theTest.types = theUserResponsesAPI[0]

                    if (theTest.textQuery != theUserResponsesAPI[1])
                        theTest.textQuery = theUserResponsesAPI[1];
                    prevValues.pop();
                    break;

                case 2: 
                    if (theTest.types != theUserResponsesAPI[0])
                        theTest.types = theUserResponsesAPI[0]
                    if (theTest.textQuery != theUserResponsesAPI[1])
                        theTest.textQuery = theUserResponsesAPI[1]
                    prevValues.pop();
                    break;
                case 3: //this is an easy reset
                    theTest.priceLevel = null;
                    break;
    
                case 5: //no case 4 since at the moment, it goes instantly after choosing rating
                    theTest.name = null;
                    break;

                case 6: //for the fuel question
                    theTest.fuel_type = null; 
    
            }
        }
        console.log("After back:")
        console.log(theTest); //debugging
        changeDes(previousResponses[0]); 
        prevKeys.pop();
        if (prevKeys.length == 0)
            setSearchP(false); //hides the text
    }

    const changeSpecLoc = (e) => { //to tell us that the user is ready to search with name
        e.preventDefault();
        const text = e.target.nameSearch.value;
        setTheTest(new Responses()); //here, I do a full reset on the object because the types the user currently selected and the name of the service might not be connected. 
        // Like the user can select food as type, but then search Academy, which would lead to no services showing up due to strict type searching.
        theTest.name = text[0].toUpperCase() + text.length > 1 ? text.substring(1): "";
        setResponses(theTest)
        changeLoading()
        func()
    }

    const generalSearch = ()=> { //ready to search generally
        setGeneralSearch(true);
    }


    async function destValue(valueSelect, mapKey, apiValue){
        console.log(mapKey);
        if (destSelect == current){ //to show text
            setSearchP(true);
        }
        if (valueSelect != "No Preference") { //we do not need to change or update values if no preference
            switch (ques.question[1]){ //looks at the grouping index
                case 0:
                    prevValues.push([theTest.main_category, theTest.textQuery]); //stores the previous values before change
                    theTest.main_category = valueSelect; 
                    theTest.textQuery = valueSelect;
                    break;
                case 1: //this focuses on types changes and sometimes textQuery
                    let temp = null;
                    prevValues.push([theTest.types, theTest.textQuery]); //we push the previous values first
                    
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
                                theTest.types = theTest.types? `${temp}_${theTest.types}`: theTest.types = temp;
                                theTest.textQuery = `${valueSelect} ${theTest.textQuery}`;
                                break;

                            case 2:
                                temp = temp.replaceAll(" ", "_");
                                theTest.types = theTest.types? `${temp}_${theTest.types}`: theTest.types = temp;
                                theTest.textQuery = theTest.types.replaceAll("_", " ");
                                break;

                            case 3:
                                temp = temp.replaceAll(" ", "_");
                                theTest.types = temp;
                                theTest.textQuery = valueSelect;
                                break;
                            
                            case 4:
                               theTest.textQuery = temp;
                               break

                            case 5:
                                temp = temp.replaceAll(" ", "_");
                                theTest.types = temp;
                                theTest.textQuery = `${valueSelect} ${theTest.textQuery}`;
                                break;
                        }
       
                    }
                    break;
                case 2:
                    prevValues.push([theTest.types, theTest.textQuery]);
                    if (apiValue[0] == 1) {
                        let temp;
                        if (apiValue[1]) {
                            temp = apiValue[1].toLowerCase();
                            temp = temp.replaceAll(" ", "_");
                        }
                        else if (valueSelect.includes(" ")) {
                            temp = valueSelect.replaceAll(" ", "_");
                        }
                        theTest.types = temp ? temp: valueSelect.toLowerCase();
                    }
  
                    else if (apiValue[0] == 2) {  //this only changes the text query
                        let realValue;
                        if (apiValue[1]) {
                            realValue = apiValue[1];
                            realValue.includes(theTest.textQuery) ? realValue = realValue.replace(" " + theTest.textQuery, ""): null;
                        }
                        else if (valueSelect.includes(theTest.textQuery)){
                            realValue = valueSelect.replace(" " + theTest.textQuery, "");
                        }
                        theTest.textQuery ? theTest.textQuery =  `${realValue ? realValue: valueSelect} ${theTest.textQuery}`: theTest.textQuery = realValue? realValue : valueSelect;  
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
                        theTest.types = temp ? temp: valueSelect.toLowerCase();
                        theTest.textQuery =  theTest.types.replaceAll("_", " ");
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
                        theTest.types? `${temp}_${theTest.types}`: theTest.types = temp;
                        theTest.textQuery =  theTest.types.replaceAll("_", " ");
                    }
                        
                    break;
                case 3:
                    theTest.priceLevel = "PRICE_LEVEL_"+ valueSelect.toUpperCase();
                    break;
                case 4: 
                    const theNumber = valueSelect.split(/[+-]/); //regex to get the number seperated from plus or minus symbol
                    theTest.rating = Number(theNumber[0]);
                    break;
                case 5:
                    theTest.name = valueSelect; 
                    break;
                case 6:
                    theTest.fuel_type = valueSelect.replaceAll(" ", "_");
            }   
        }

        // console.log("prevValues: "); //debugging
        // console.log(prevValues);
        console.log("theTest in Question component: ")
        console.log(theTest);
        prevKeys.push([destSelect, valueSelect]);
        changeDes(mapKey);
      
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

        if (mapKey == "End") { 
            setResponses(theTest);//to have the object in mulitple pages
            setFinished(true);
        }
    
  }


    useEffect(() => { //this only called if finished and destSelect changes in values.
        if (readyGeneralSearch) 
            setResponses(theTest)
        
        if ((finished && destSelect === "End") || readyGeneralSearch) { 
            changeLoading();
            func();// this is a function call from the questionaire page that just routes to services menu
        }
      }, [finished, readyGeneralSearch]);

    return (
        <div className={`grid ${userEmail && !start ? "grid-rows-2": "grid-rows-3"} lg:grid-cols-2 h-full`}>
            <div className="w-full md:h-2/3 lg:row-span-3">
                <div className={`flex flex-col mt-4 md:mt-10 lg:mt-0 ${generalSearchP && start ? "": "justify-center"} md:justify-center items-center h-full p-3`}>
                    {start ? 
                    <div className="w-full">
                        <h1 className="text-xl md:text-3xl lg:text-5xl text-center font-extrabold text-content-text">{ques.question[0]}</h1>
                        {prevKeys.length > 0 &&
                        <div className="text-center">
                            <button onClick = {gotoPrev} className="outline-content-text text-content-text outline-2 mt-3 md:mt-10 w-3/4 md:w-1/2 text-base md:text-lg lg:text-xl md:p-3">Go To Previous Question</button>
                        </div>
                        }
                        {generalSearchP &&
                        <div className="mt-2 md:mt-10 text-base md:text-xl lg:text-2xl text-center text-content-text">
                            <div className="mb-1 md:mb-3">Ready to search for places?</div> 
                            <div className="mb-1 md:mb-3 font-bold">Click below :</div>
                            <div className="">
                                <button className="outline-text-content outline-2 w-1/2 md:p-2" onClick={generalSearch} type = "button">Done</button>
                            </div>
                        </div>
                        }
                    </div>
                    :
                    <div className="px-5">
                        <div className="text-xl md:text-2xl lg:text-3xl/10 text-content-text">Have a specific name or search in mind? Enter it below and see if its near your area!</div>
                        <div className="mt-5 w-full"> 
                            <form onSubmit={changeSpecLoc}>
                                <input className="w-3/4 text-center border-b-1 mr-2 text-base md:text-xl lg:text-2xl text-content-text" placeholder="Enter your search here" id="nameSearch" required></input>
                                <button className="outline-content-text text-content-text outline-1 md:text-xl lg:text-2xl p-1 w-1/5" type= "submit">Enter</button>
                            </form>
                        </div>
                        {(!generalSearchP && userEmail != null) &&
                        <>
                            <div className="text-xl md:text-2xl lg:text-3xl text-content-text mt-5 md:mt-20 text-center">Or select from one of your favorites to continue: </div>
                            <SelectFavorites/>
                        </>
                        }
                    </div>
                    }

                </div>
                
            </div>
            <div className={`${userEmail && !start ? "": "row-span-2"} lg:row-span-3 lg:w-19/20 p-5 md:p-10 bg-question-info/85 h-9/10 rounded-lg`}>
                <div className="flex flex-col md:justify-center items-center h-full text-center">
                {start ?
                    <div className="w-full grid grid-cols-2 gap-5 h-full">
                    {ques.answer.map((answer_array, index)=> (
                    <div key = {`${index} ${answer_array[0]}`} className="text-center max-h-50 h-4/5 bg-land-card flex justify-center items-center rounded-lg shadow-lg inset-shadow-sm" onClick={ () => {
                        let temp = answer_array[2] ? answer_array[2] : ""
                        destValue(answer_array[0], answer_array[1], temp);
                    }}>
                        <div className="text-base md:text-2xl lg:text-3xl text-black font-bold w-full px-3 break-words text-content-text">
                            {answer_array[0]}
                        </div>
                    </div>))}
                </div>
                :
                <>
                    <div className="text-xl md:text-2xl lg:text-3xl/10 text-white">
                        <p>Need help deciding what service you would like? Try our questionnaire to create a search with you are looking for!
                        <span className="font-bold block mt-3">Click Start to begin! </span></p>
                    </div>
                    <div className="mt-4 w-full text-3xl text-white">
                        <button onClick={()=> SetStart(true)} className="outline-white outline-2 w-1/2">Start</button>
                    </div>
                </>
                }

                </div>
            </div>
        </div>

       
        
    );
    //answer_array indexes values are :
    //0: The response string. EX: "Museum", "Food and Drink", etc
    //1: The key for the map. This just says where to go in hash map if the option is picked
    //2: Some have an additonal value for the API value. Otherwise it would be treated as ""
}

export default Question;

