function Loading ({message}){
    return (
        <div className="w-100 h-100 bg-secondary-subtle d-flex justify-content-center align-items-center">
            <div className="text-center fs-1"> {message ? message : "Loading" } </div>
        </div>
    )
}

export default Loading;