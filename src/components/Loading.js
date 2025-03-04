function Loading ({message}){
    return (
        <div className="w-100 h-100 bg-secondary-subtle d-flex justify-content-center align-items-center">
            <div className="row row-cols-1">
                <div className="text-center fs-1 col mb-4"> {message ? message : "Loading" } </div>
                <div className="col d-flex justify-content-center"><img className="w-25 h-75" src = "https://i.gifer.com/ZKZg.gif" alt = "loading gif" /></div>
            </div>

        </div>
    )
}

export default Loading;