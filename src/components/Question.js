import { useState, useEffect } from "react";
import { useAppContext } from "@/context";
import { testExistingUser, addQuestion } from "./DBactions";
import { useSearchParams } from "next/navigation";

//object to help with Places API calls
class Responses {
  constructor() {
    this.main_category = null;
    this.types = null;
    this.priceLevel = null;
    this.rating = null;
    this.name = null;
    this.textQuery = null;
  }
}
//General search is how I refer to skipping some parts of questionnaire and only responding to current responses 
function Question({theQuestion, current, func, changeLoading}){
    const {setResponses, userEmail} = useAppContext();  //used to pass the respones of the user to other pages (mainly services menu page)
    const [valueSelect, valueSelected] = useState(''); //what the user sees and selects
    const [apiValue, setAPIvalue] = useState(''); //used if the value shown is going to be different for API call. Ex: Entertainment, Actual API Value: Entertainment and Recreation
    const [destSelect, changeDes] = useState(''); //destination for map purposes
    const [prevKeys] = useState([]);
    const [prevValues] = useState([]);
    const [mapKey, setKey] = useState(current);
    const ques = theQuestion.get(mapKey); //this is how each question is rendered each time
    const [finished, setFinished] = useState(false); //used to make sure that all values are updated before moving to next page
    const [theTest] = useState(new Responses()); //the created object for API calls
    const [nameValue, setNameValue] = useState(''); //for searching service purposes
    const [generalSearchP, setSearchP] = useState(false); //to show and hide the section for general searching
    const [nameSearch, setNameSearch] = useState(false); //to know when the user is ready to search for a service via name
    const [readyGeneralSearch, setGeneralSearch] = useState(false); //to know when a user is ready to search for a services via general search 
    const [wentBack, setBack] = useState(false); //Forms submits when back button is pressed. This is used to stop that

    function gotoPrev() {
        if (prevKeys.length === 0) //this means we are at the first question, leave
            return;
        const previousResponses = prevKeys[prevKeys.length-1]; //this is an array of tuples. It holds the previous question key to go back as well as the user selected option
        
        const prevQuestion = theQuestion.get(previousResponses[0]); //gets the values from hash map with the previous key
        for (let i of prevQuestion.answer){
            if (i[0] === previousResponses[1]) { //this is to check if the value has an api value. Used in case the user presses enter on same input
                setAPIvalue(i[2] ? i[2]: "");    
                break;
            }
        }
        console.log(prevValues);
        if (previousResponses[1] != "No Preference") { //the values did not change
            const theUserResponsesAPI = prevValues[prevValues.length-1]; //this is an array of arrays that records user respones that deals with API calls. First index is actual recorded value and second is the textQuery values
            const previousUserAPI = prevValues[prevValues.length-2]; //Similar to above, but this is to replace current with previous. 
            switch (prevQuestion.question[1]){ //this is the grouping
                case 0: //if we are here, that means it the first question, which means full reset
                    theTest.main_category = null; 
                    theTest.textQuery = null;
                    break;
                case 1: 
                    if (theTest.types?.includes('_')){ //there are two possible options, either its two types together connected with _ or one type that has at least one _

                        if (theTest.types === theUserResponsesAPI[0]){  //this means it is one word
                            theTest.types = theTest.types.replace(theUserResponsesAPI[0], "");
                            if (theTest.types === "") //had to do this because it would replace it with an actual string "null"
                                theTest.types = null;
                            theTest.textQuery = theTest.textQuery.replace(theUserResponsesAPI[1], previousUserAPI[1]);
                        }
                        else{
                            theTest.types = theTest.types.replace(theUserResponsesAPI[0] + "_", ""); //this means there are seperate types connected with _
                            theTest.textQuery = theTest.textQuery.replace(theUserResponsesAPI[1] + " ", ""); //removed the part of string that references the current response
                        }
                    }
                    else { 
                        theUserResponsesAPI && theUserResponsesAPI[2] == false? null :theTest.types = null; //for the cafe edge case
                        theTest.textQuery = previousUserAPI[1];
                    }
                    prevValues.pop();
                    break;
                case 2: //case 2 only deals with textQuery
                    theTest.textQuery = theTest.textQuery.replace(theUserResponsesAPI[0] + " ", "");
                    prevValues.pop();
                    break;
                case 3: //this is an easy reset
                    theTest.priceLevel = null;
                    break;
    
                case 5: //no case 4 since at the moment, it goes instantly after choosing rating
                    theTest.name = null;
    
            }
        }
        console.log(apiValue);
        console.log("After back:")
        console.log(theTest); //debugging
        console.log(mapKey);
        changeDes(mapKey); //used in case the user wants to go forward with selected response (basically go back then forward)
        setKey(previousResponses[0]); //this is used to show previous questions and 
        valueSelected(previousResponses[1]);
        prevKeys.pop();
        if (prevKeys.length == 0)
            setSearchP(false); //hides the text
        setBack(true); //for some reason, the form would submit even though the back button is not a form button. This is to stop that from happening or at least from going through the whole function
        //but I don't know why it wants to work and sometimes it does not 

    }

    const changeSpecLoc = (e) => { //to tell us that the user is ready to search with name
        setNameSearch(true);
        e.preventDefault();
    }


    const changeNameValue = (e)=>{ //for textbox
        setNameValue(e.target.value);
    }

    const generalSearch = ()=> { //ready to search generally
        setGeneralSearch(true);
    }


    function changeValue(theEvent){
        const selectOptionDest = theEvent.target.selectedOptions[0].getAttribute("data-destination");  //gets the first select value (in this case, are only selected) then find the value of "data-other" 
        const selectedAPIValue = theEvent.target.selectedOptions[0].getAttribute("data-valueforapi");
        valueSelected(theEvent.target.value);
        changeDes(selectOptionDest);
        setAPIvalue(selectedAPIValue);
    }

    async function destValue(theEvent){
        theEvent.preventDefault();
        if (prevKeys.length == 0 && wentBack){ //to prevent form submission for the first question (IDK its weird why it does this for only the first option)
            setBack(false);
            return;
        }
        if (valueSelect == '') { //to prevent default value of select box to be selected
            alert("Please choose an option")
            return;
        }
        if (mapKey == current){ //to show text
            setSearchP(true);
        }
        if (valueSelect != "No Preference") { //we do not need to change or update values if no preference
            switch (ques.question[1]){ //looks at the grouping index
                case 0:
                    theTest.main_category = apiValue === "" ? valueSelect: apiValue; 
                    theTest.textQuery = valueSelect;
                    prevValues.push([theTest.main_category, theTest.textQuery]);
                    break;
                case 1:
                    let temp = null;
                    //always choosing the api value to be passed to object, otherwise if there is no API value, that means the value selected is the same as API value
                    //Ex: Value: "Arts", API value: "Culture". If apiValue == "" that means apiValue is the valueSelect, ex: Value: "Mexican" API value = "mexican"
                    if (apiValue != ""){
                        if (apiValue != "No Change"){
                            temp = apiValue.toLowerCase();
                            if (theTest.types)
                                //if a type was added and if not food drink main category, replace the old value with new. Else add to the beginning of the string in API Call format: types_call
                                theTest.textQuery != "Food and Drink" ? theTest.types = temp : theTest.types = `${temp}_${theTest.types}`;
                            else 
                                theTest.types = temp; //this means they are not existing types currently in object. Therefore just add it

                        }
                    }
                    else {
                        temp = valueSelect.toLowerCase();
                        theTest.types ? theTest.types =`${temp}_${theTest.types}`: theTest.types = temp;
                    }
                        //if the property has a string, then add to string, otherwise replace it

                    //this is just saying if we are in the food drink category, don't replace, but add unless theText query property is actually the string "Food and Drink"
                    theTest.main_category === 'Food and Drink' && theTest.textQuery != 'Food and Drink' ? theTest.textQuery = `${valueSelect} ${theTest.textQuery}` : theTest.textQuery = valueSelect;
                    let makeChange = temp == null ? false : true;
                    prevValues.push([temp, valueSelect, makeChange]);
                    console.log(prevValues); //debugging
                    break;
                case 2:
                    theTest.textQuery ? theTest.textQuery = `${valueSelect} ${theTest.textQuery}`: theTest.textQuery = valueSelect;  
                    prevValues.push([valueSelect]);
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
            }
        }
        console.log("theTest in Question component: ")
        console.log(theTest);
        prevKeys.push([mapKey, valueSelect]);
        setKey(destSelect);
        valueSelected('');
      
        if (userEmail != null) {
            try {
                const exists = await testExistingUser(userEmail[1]);
                if (exists) {
                    await addQuestion(userEmail[1], ques.question[0], valueSelect);
                } else {
                    console.error("user doesnt exist in db:", userEmail[1]);
                }
            } catch (e) {
                console.error("error storing question and answer:", e);
            }
        }

        if (apiValue != '') //if there was an api value, reset it for next time
            setAPIvalue('');
        if (destSelect == "End") { 
            setResponses(theTest);//to have the object in mulitple pages
            setFinished(true);

        }
    
  }


    useEffect(() => { //this only called if finished and destSelect changes in values.
        if (nameSearch){
            setGeneralSearch(true);
            theTest.name = nameValue[0].toUpperCase() + nameValue.substring(1);
        }
        if (readyGeneralSearch) 
            setResponses(theTest)
        
        if ((finished && destSelect === "End") || readyGeneralSearch) { 
            changeLoading();
            func();// this is a function call from the questionaire page that just routes to services menu
            setFinished(false); 
        }
      }, [destSelect, finished, nameSearch, readyGeneralSearch]);

    return (
    <>
        <div className="container mt-4 mb-5">
            <div>
                <div className="mb-4">
                    <div className = "container">
                        <div className = "text-center text-white">
                            <h1 className="fs-3">{ques.question[0]}</h1>
                        </div>
                        <form onSubmit={destValue}>
                            <div className="row row-cols-3">
                                {prevKeys.length > 0 ? 
                                <>
                                    <div className="col-10"> 
                                        <select className="form-select" value = {valueSelect} onChange={changeValue}>
                                            <option value="" disabled>Select</option>
                                            {ques.answer.map((answer_array, index) => (
                                            <option key = {[index, answer_array[0]]} value = {answer_array[0]} data-valueforapi = {answer_array[2] ? answer_array[2] : ""} data-destination = {answer_array[1]}>{answer_array[0]}</option>
                                            )
                                            )}
                                        </select>
                                    </div>
                                    <div className="col-1 d-flex align-items-top">
                                        <button type="button" onClick={gotoPrev} className="btn btn-primary w-100">Back</button> 
                                    </div>
                                    <div className="col-1">
                                        <button  type="submit" className="btn btn-primary w-100">Next</button>
                                    </div>
                                </>: 
                                <>
                                    <div className="col-11"> 
                                        <select className="form-select" value = {valueSelect} onChange={changeValue}>
                                            <option value="" disabled>Select</option>
                                            {ques.answer.map((answer_array, index) => (
                                            <option key = {[index, answer_array[0]]} value = {answer_array[0]} data-valueforapi = {answer_array[2] ? answer_array[2] : ""} data-destination = {answer_array[1]}>{answer_array[0]}</option>
                                            )
                                            )}
                                        </select>
                                    </div>
                                    <div className="col-1">
                                        <button  type="submit" className="btn btn-primary w-100">Next</button>
                                    </div>
                                </>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="text-center">
                {generalSearchP && 
                <>
                    <div className="fs-3 text-white">Ready to search for places?(Note: this does not include current response)</div> 
                    <div className="w-100">
                        <div className="fs-3 text-white">Click here :</div>
                        <button className="btn btn-primary w-25" onClick={generalSearch} type = "button">Done</button>
                    </div>
                </>
                }
            </div>
        </div>

        <div className="container text-center">
        <div className="fs-4 text-white">Have a specific location in mind?</div>
            <div>
                <form onSubmit={changeSpecLoc}>
                    <input className="w-50 text-center" placeholder="Enter your location here" value ={nameValue} onChange={changeNameValue} required></input>
                    <button className="btn btn-primary" type= "submit">Enter</button>
                </form>
            </div>
        </div>

    </>

    );
    //answer_array indexes values are :
    //0: The response string. EX: "Museum", "Food and Drink", etc
    //1: The key for the map. This just says where to go in hash map if the option is picked
    //2: Some have an additonal value for the API value. Otherwise it would be treated as ""
}

export default Question;