export default function Land_Square({index, info}){
    return(
        <div className="h-full">
            <div className="w-full md:w-9/10 h-full flex justify-center flex-col rounded-xl bg-land-card shadow-md">
                <div className={`flex justify-center ${index == 2 ? "pt-5 md:pt-0": "pt-5"} h-2/5`}>
                    <div className="w-full">
                        <div className="w-full flex justify-center">
                        {index == 0 ?
                        <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            
                            <path d="M12 2C8 2 5 5.13 5 9c0 4.75 5 11 7 13 2-2 7-8.25 7-13 0-3.87-3-7-7-7z" fill="#2563eb"/>
                            
                            <circle cx="12" cy="9" r="3" fill="white"/>
                        </svg>
                        : index == 1 ?
                        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        
                        <circle cx="25" cy="25" r="22" stroke="#2563eb" strokeWidth="4" fill="white"/>
                        
                        <path d="M15 25 L22 32 L35 18" stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        :
                        <svg width="50" height="50" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
                            
                            <circle cx="50" cy="50" r="48" stroke="#2563eb" strokeWidth="4" fill="white"/>

                            
                            <line x1="50" y1="50" x2="50" y2="20" stroke="#2563eb" strokeWidth="4" strokeLinecap="round"/>
                            <line x1="50" y1="50" x2="70" y2="50" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/> 

                            
                            <circle cx="50" cy="50" r="3" fill="#2563eb"/>
                        </svg>
                        }
                        </div>
                        <div className="font-bold pb-2 text-center text-content-text">{info.title}</div>
                    </div>

                </div>
                <div className="text-content-text/95 w-full flex flex-col items-center justify-center">
                    <ul className="list-inside list-disc border-t-0 text-xl/7 px-5 py-3">
                    {info.text.map((theText, index) => 
                        <li key = {index}>{theText}</li>
                    )}
                    </ul>
                </div>
            </div>
            
        </div>
    )
}