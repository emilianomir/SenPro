
import "../css/address_page.css"

function AddressPage(){
    return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="bg-secondary-subtle main_container">
                    <p className="text-center main_text">Please enter either your physical address or your Zip Code. </p>
                    <p className="text-center main_text fw-bold">(Recommend address for best experience).</p>
                    <div className=" ms-5 mt-5">
                        <form>
                            <label htmlFor="addressInput" className="form-label fs-3">Address/ZipCode</label>
                            <div className = "row row-cols-2">
                                <div className="col-11">
                                    <input id = "addressInput" className="form-control" type = "text" placeholder="Enter your address here"/>
                                </div>
                                <div className="col-1">
                                    <button type = "submit" className="btn btn-primary">Enter</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

            </div>  
        
    )

}

export default AddressPage;