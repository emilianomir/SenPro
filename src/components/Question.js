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
    const [destSelect, changeDes] = useState('');
    const [mapKey, setKey] = useState(current);
    const ques = theQuestion.get(mapKey);
    const [finished, setFinished] = useState(false);
    const [theTest, changeTest] = useState(new Responses());

    function changeValue(theEvent){
        const selectOptionDest = theEvent.target.selectedOptions[0].getAttribute("data-destination");  //gets the first select value (in this case, are only selected) then find the value of "data-other" 
        valueSelected(theEvent.target.value);
        changeDes(selectOptionDest);

    }

    function destValue(theEvent){
        switch (ques.question[1]){
            case 0:
                theTest.main_category = valueSelect;
                break;
            case 1:
                theTest.types ? theTest.types =`${valueSelect.toLowerCase()}_${theTest.types}`: theTest.types = valueSelect.toLowerCase();
                break;
            case 2:
                theTest.category = valueSelect;
                break;
            case 3:
                valueSelect === "No Preference" ? null: theTest.priceLevel = "PRICE_LEVEL_"+ valueSelect.toUpperCase();
                break;
            case 4: 
                const theNumber = valueSelect.split(/[+-]/);
                console.log(theNumber);
                valueSelect === "No Preference" ? null: theTest.rating = Number(theNumber[0]);
                break;
            case 5:
                valueSelect === "No Preference" ? null: theTest.name = valueSelect; //I know I don't set the value. I just put null to do the teritary. Default is null
                break;
        }
        changeTest(theTest);
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
                        {ques.answer.map((desc, index) => (
                        <option key = {[index, desc[0]]} value = {desc[0]} data-destination = {desc[1]}>{desc[0]}</option>
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