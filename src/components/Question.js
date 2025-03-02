import { useState, useEffect } from "react";
import { useAppContext } from "@/context";


class Responses{
    constructor(){
        this.main_category = null;
        this.types = null;
        this.category = null;
        this.priceLevel = null;
        this.rating = null;
        this.name = null;
    }
}

function Question({theQuestion, current, func}){
    const {setResponses} = useAppContext();
    const [valueSelect, valueSelected] = useState('');
    const [apiValue, setAPIvalue] = useState('');
    const [destSelect, changeDes] = useState('');
    const [mapKey, setKey] = useState(current);
    const ques = theQuestion.get(mapKey);
    const [finished, setFinished] = useState(false);
    const [theTest, changeTest] = useState(new Responses());

    function changeValue(theEvent){
        const selectOptionDest = theEvent.target.selectedOptions[0].getAttribute("data-destination");  //gets the first select value (in this case, are only selected) then find the value of "data-other" 
        const selectedAPIValue = theEvent.target.selectedOptions[0].getAttribute("data-valueforapi")
        valueSelected(theEvent.target.value);
        changeDes(selectOptionDest);
        if (selectedAPIValue != "")
            setAPIvalue(selectedAPIValue);
    }

    function destValue(theEvent){
        if (valueSelect != "No Preference") {
            switch (ques.question[1]){
                case 0:
                    theTest.main_category = apiValue === "" ? valueSelect: apiValue;
                    break;
                case 1:
                    if (apiValue != ""){
                        if (theTest.types)
                            apiValue === theTest.types ? null: theTest.main_category != "Food and Drink" ? theTest.types = apiValue.toLowerCase() : `${apiValue.toLowerCase()}_${theTest.types}`  //if a type was added and the incoming type is same type string, do nothing, else if not food drink, replace the old value with new.
                        else 
                            theTest.types = apiValue.toLowerCase()
                    }
                    else 
                        theTest.types ? theTest.types =`${valueSelect.toLowerCase()}_${theTest.types}`: theTest.types = valueSelect.toLowerCase();
                    break;
                case 2:
                    theTest.category =  apiValue === "" ? valueSelect: apiValue;
                    break;
                case 3:
                    theTest.priceLevel = "PRICE_LEVEL_"+ valueSelect.toUpperCase();
                    break;
                case 4: 
                    const theNumber = valueSelect.split(/[+-]/);
                    theTest.rating = Number(theNumber[0]);
                    break;
                case 5:
                    theTest.name = valueSelect; 
                    break;
            }
            changeTest(theTest);
        }



        console.log("theTest in Question component: ")
        console.log(theTest);
        setKey(destSelect);
        theEvent.preventDefault();
        valueSelected('');
        if (destSelect == "End") {
            setResponses(theTest);
            setFinished(true);
        }

    }

    useEffect(() => {
        if (finished && destSelect === "End") {
            func();
            setFinished(false); 
        }
      }, [destSelect, finished]);

    return (
    <div className = "container">
        <div className = "text-center text-white">
            <h1 className="fs-3">{ques.question[0]}</h1>
        </div>
        <form onSubmit={destValue}>
            <div className="row row-cols-2">
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
                    <button  type="submit" className="btn btn-primary w-100">Enter</button>
                </div>
 
            </div>
        
        </form>

    </div>
    );

}

export default Question;