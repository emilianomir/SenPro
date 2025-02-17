import RouteButton from "../../../components/route_button";

function WelcomePage(){
    return (
        <>
            <div className = "position-relative">
                <div className = "position-absolute top-0 end-0">
                    <button type = "button" className="btn btn-primary fs-3">Login</button> 
                </div>

            </div>

            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className = "container bg-secondary-subtle text-center h-50 row row-cols-1">
                    <div className="col d-flex justify-content-center pt-4 pb-0">
                        <h1 className="fs-1 fw-bold text-center w-50">Welcome to your services planner page! </h1>
                    </div>
                    <div className="col d-flex justify-content-center">
                        <div className="w-25" >
                            <button type = "button" className="btn btn-primary w-100 fs-3">Register</button>
                        </div>
                        <RouteButton name ="hi" location = "/" />
                    </div>
                </div>
            </div>

        </>
    )
}

export default WelcomePage;