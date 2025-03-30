import RouteButton from "@/components/route_button";
export default function Home_Squares({info}) {
    return(                        
    <div className="rounded-lg bg-slate-700/50">
        <h3 className="text-center bg-slate-500 rounded-t-lg text-2xl py-4 font-semibold">{info.heading}</h3>
            <p className="text-center text-xl my-3 py-4">{info.text}</p>
            <div className="w-full flex justify-center pb-5"> 
                <div className="w-1/2">
                    <RouteButton name = {"GO!"} location = {info.location} />
                </div>
            </div>
    </div>
    )
}