import { useState, useEffect } from "react";
import { useAppContext } from "@/context";
import { testExistingUser, addQuestion } from "./DBactions";

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


function Question({ theQuestion, current, func, userEmail }) {
  const { setResponses } = useAppContext(); //used to pass the respones of the user to other pages (mainly services menu page)
  const [valueSelect, valueSelected] = useState(""); //what the user sees and selects
  const [apiValue, setAPIvalue] = useState(""); //used if the value shown is going to be different for API call. Ex: Entertainment, Actual API Value: Entertainment and Recreation
  const [destSelect, changeDes] = useState(""); //destination for map purposes
  const [mapKey, setKey] = useState(current);
  const ques = theQuestion.get(mapKey);
  const [finished, setFinished] = useState(false); //used to make sure that all values are updated before moving to next page
  const [theTest, _] = useState(new Responses()); //the created object for API calls


  function changeValue(theEvent) {
    const selectOptionDest =
      theEvent.target.selectedOptions[0].getAttribute("data-destination"); //gets the first select value (in this case, are only selected) then find the value of "data-other"
    const selectedAPIValue =
      theEvent.target.selectedOptions[0].getAttribute("data-valueforapi");
    valueSelected(theEvent.target.value);
    changeDes(selectOptionDest);
    if (selectedAPIValue != "") setAPIvalue(selectedAPIValue);
  }

  async function destValue(theEvent) {
    theEvent.preventDefault();
    if (userEmail && valueSelect !== "") {
      try {
        await addQuestion(userEmail, ques.question[0], valueSelect);
      } catch (e) {
        console.error("coudlnt add the question and answer to the db", e);
      }
    }
    if (valueSelect != "No Preference") {
      //we do not need to change or update values if no preference
      switch (
        ques.question[1] //looks at the grouping index
      ) {
        case 0:
          theTest.main_category = apiValue === "" ? valueSelect : apiValue;
          theTest.textQuery = valueSelect;
          break;
        case 1:
          //always choosing the api value to be passed to object, otherwise if there is no API value, that means the value selected is the same as API value
          //Ex: Value: "Arts", API value: "Culture". If apiValue == "" that means apiValue is the valueSelect, ex: Value: "Mexican" API value = "mexican"
          if (apiValue != "") {
            if (theTest.types)
              //if a type was added and the incoming type is same string, do nothing, else if not food drink main category, replace the old value with new. Else add to the beginning of the string in API Call format: types_call
              apiValue === theTest.types
                ? null
                : theTest.textQuery != "Food and Drink"
                ? (theTest.types = apiValue.toLowerCase())
                : `${apiValue.toLowerCase()}_${theTest.types}`;
            else theTest.types = apiValue.toLowerCase();
          }
          //if the property has a string, then add to string, otherwise replace it
          else
            theTest.types
              ? (theTest.types = `${valueSelect.toLowerCase()}_${
                  theTest.types
                }`)
              : (theTest.types = valueSelect.toLowerCase());
          //this is just saying if we are in the food drink category, don't replace, but add unless theText query property is actually the string "Food and Drink"
          theTest.main_category === "Food and Drink" &&
          theTest.textQuery != "Food and Drink"
            ? (theTest.textQuery = `${valueSelect} ${theTest.textQuery}`)
            : (theTest.textQuery = valueSelect);
          break;
        case 2:
          theTest.textQuery
            ? (theTest.textQuery = `${valueSelect} ${theTest.textQuery}`)
            : (theTest.textQuery = valueSelect);
          break;
        case 3:
          theTest.priceLevel = "PRICE_LEVEL_" + valueSelect.toUpperCase();
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

    function destValue(theEvent){
        if (valueSelect != "No Preference") { //we do not need to change or update values if no preference
            switch (ques.question[1]){ //looks at the grouping index
                case 0:
                    theTest.main_category = apiValue === "" ? valueSelect: apiValue; 
                    theTest.textQuery = valueSelect;
                    break;
                case 1:
                    //always choosing the api value to be passed to object, otherwise if there is no API value, that means the value selected is the same as API value
                    //Ex: Value: "Arts", API value: "Culture". If apiValue == "" that means apiValue is the valueSelect, ex: Value: "Mexican" API value = "mexican"
                    if (apiValue != ""){
                        if (theTest.types)
                            //if a type was added and the incoming type is same string, do nothing, else if not food drink main category, replace the old value with new. Else add to the beginning of the string in API Call format: types_call
                            apiValue === theTest.types ? null: theTest.textQuery != "Food and Drink" ? theTest.types = apiValue.toLowerCase() : `${apiValue.toLowerCase()}_${theTest.types}`  
                        else 
                            theTest.types = apiValue.toLowerCase()
                    }
                    else 
                        //if the property has a string, then add to string, otherwise replace it
                        theTest.types ? theTest.types =`${valueSelect.toLowerCase()}_${theTest.types}`: theTest.types = valueSelect.toLowerCase();
                    //this is just saying if we are in the food drink category, don't replace, but add unless theText query property is actually the string "Food and Drink"
                    theTest.main_category === 'Food and Drink' && theTest.textQuery != 'Food and Drink' ? theTest.textQuery = `${valueSelect} ${theTest.textQuery}` : theTest.textQuery = valueSelect;
                    break;
                case 2:
                    theTest.textQuery ? theTest.textQuery = `${valueSelect} ${theTest.textQuery}`: theTest.textQuery = valueSelect;  
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
        setKey(destSelect);
    async function destValue(theEvent){
        theEvent.preventDefault();
        addResponse([...response, valueSelect]); // store value of answer

        if (userEmail) { // if user email is passed in, store question and answer
            try {
                const exists = await testExistingUser(userEmail); // test if user exists
                if (exists) {
                    await addQuestion(userEmail, ques.question, valueSelect);
                } else {
                    console.error("user doesnt exist in db:", userEmail);
                }
            } catch (e) {
                console.error("error storing question and answer:", e);
            }
        }
        setKey(destSelect);
        valueSelected('');
        if (apiValue != '') //if there was an api value, reset it for next time
            setAPIvalue('');
        if (destSelect == "End") { 
            setResponses(theTest);//to have the object in mulitple pages
            setFinished(true);
        }

    console.log("theTest in Question component: ");
    console.log(theTest);
    setKey(destSelect);
    theEvent.preventDefault();
    setKey(destSelect);
    valueSelected("");
    if (apiValue != "")
      //if there was an api value, reset it for next time
      setAPIvalue("");
    if (destSelect == "End") {
      setResponses(theTest); //to have the object in mulitple pages
      setFinished(true);
    }
  }

  useEffect(() => {
    //this only called if finished and destSelect changes in values.
    if (finished && destSelect === "End") {
      func(); // this is a function call from the questionaire page that just routes to services menu
      setFinished(false);
    }
  }, [destSelect, finished]);

  return (
    <div className="container">
      <div className="text-center text-white">
        <h1 className="fs-3">{ques.question[0]}</h1>
      </div>
      <form onSubmit={destValue}>
        <div className="row row-cols-2">
          <div className="col-11">
            <select
              className="form-select"
              value={valueSelect}
              onChange={changeValue}
            >
              <option value="" disabled>
                Select
              </option>
              {ques.answer.map((answer_array, index) => (
                <option
                  key={[index, answer_array[0]]}
                  value={answer_array[0]}
                  data-valueforapi={answer_array[2] ? answer_array[2] : ""}
                  data-destination={answer_array[1]}
                >
                  {answer_array[0]}
                </option>
              ))}
            </select>
          </div>
          <div className="col-1">
            <button type="submit" className="btn btn-primary w-100">
              Enter
            </button>
          </div>
        </div>
<<<<<<< HEAD
        <form onSubmit={destValue}>
            <div className="row row-cols-2">
                <div className="col-11">
                    <select className="form-select" value = {valueSelect} onChange={changeValue}>
                        <option value="" disabled>Select</option>
                        {ques.answer.map((desc, index) => (
                        <option key = {[index, desc[0]]}
                        value = {desc[0]}
                        data-destination = {desc[1]}>{desc[0]}
                        </option>
                        )
                        )}
                    </select>
                </div>
                <div className="col-1">
                    <button  type="submit" className="btn btn-primary w-100">Enter</button>
                </div>
 
            </div>
        
        </form>

=======
      </form>
>>>>>>> 5552ca5 (fix, add: enabled google api, question and answer to db)
    </div>
  );
  //answer_array indexes values are :
  //0: The response string. EX: "Museum", "Food and Drink", etc
  //1: The key for the map. This just says where to go in hash map if the option is picked
  //2: Some have an additonal value for the API value. Otherwise it would be treated as ""
}

export default Question;