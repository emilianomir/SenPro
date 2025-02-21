import { useState } from "react";

function Question({theQuestion, current, func}){
    const [valueSelect, valueSelected] = useState('');
    const [destSelect, changeDes] = useState('');
    const [mapKey, setKey] = useState(current);
    const ques = theQuestion.get(mapKey);


    function changeValue(theEvent){
        const selectOptionDest = theEvent.target.selectedOptions[0].getAttribute("data-destination");  //gets the first select value (in this case, are only selected) then find the value of "data-other" 
        valueSelected(theEvent.target.value);
        changeDes(selectOptionDest);

    }

    function destValue(theEvent){
        setKey(destSelect);
        theEvent.preventDefault();
        valueSelected('');
        if (destSelect == "End")
            func();
    }

    return (
    <div className = "container">
        <div className = "text-center text-white">
            <h1 className="fs-3">{ques.question}</h1>
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