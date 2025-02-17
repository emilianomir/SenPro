function StartPage(){
    return (

        <div className="d-flex justify-content-center bg-secondary align-items-center vh-100 overflow:hidden">
            <div className = "container bg-secondary-subtle text-center h-50 row row-cols-1">
                <div className="col d-flex justify-content-center pt-4 pb-0">
                    <h1 className="fs-1 fw-bold text-center w-50">How many places do you want to visit? </h1>
                </div>
                <form>
                    <div className="col  row row-cols-1" >
                        <div className="col d-flex justify-content-center">
                            <input type="number" className="fs-3 p-3 form-control w-25 h-25 text-center" id="desiredNumber" min = "0" max = "5"/>
                        </div>
                        <div className="col">
                            <button type="submit" className="btn btn-primary w-25">Enter</button>
                        </div>
                    </div>
                </form>
  
            </div>
        </div>
       


        
    );

}

export default StartPage;