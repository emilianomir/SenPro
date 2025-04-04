import { useState } from "react"

export default function Questionnaire() {
    const [start, SetStart] = useState(false);
    return(        
        <div className="w-full p-10 bg-slate-800 h-full">
        <div className="flex flex-col justify-center items-center h-full text-center">
            {start ? <div>test</div>:
            <>
                <div>
                    <p>Need help deciding what service you would like? Try our questionnaire to create a search with you are looking for!
                    <span className="font-bold block mt-3">Click Start to begin! </span></p>
                </div>
                <div className="mt-4 w-full">
                    <button onClick={()=> SetStart(true)} className="outline outline-2 w-1/2">Start</button>
                </div>
            </>
            }

        </div>
    </div>
    )
}