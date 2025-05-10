function Loading ({message}){
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="grid grid-cols-1">
                <div className="text-center text-4xl font-extrabold mb-4 text-content-text"> {message ? message : "Loading" } </div>
                <div className=" flex justify-center"><img className="" src = "/imgs/plane-loading.gif" alt = "loading gif" /></div>
            </div>

        </div>
    )
}

export default Loading;