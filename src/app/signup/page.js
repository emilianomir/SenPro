import "../css/sign_up_page.css"

function SignUpPage(){
    return (
 
        <div className = "container">
            <div className = "row row-col-1 mb-5" >
                <div className = "col title position-relative">  
                    <div className="position-absolute title_heading">
                        <h1 className = "text-white title_text">Sign In</h1>
                    </div>
                </div>
            </div>
            <div className = "container bg-secondary-subtle ms-0 mt-5 sign_form_content">
                <form>
                    <div className="mb-3">
                        <label htmlFor="inputEmail" className="form-label fs-3 mt-3">Username: </label>
                        <input type="email" placeholder="Enter your username" className="form-control" id="inputEmail" aria-describedby="emailHelp" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="inputPass" className="form-label fs-3 ">Password: </label>
                        <input type="password" placeholder="Enter your password" className="form-control" id="inputPass" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPass" className="form-label fs-3 ">Confirm Password: </label>
                        <div className = "row row-cols-2">
                            <div className="col-11">
                                <input type="password" placeholder="Re-enter your password" className="form-control" id="confirmPass" />
                            </div>

                            <div className="col-1">
                                <div className="w-100 p-0">
                                    <button type = "submit" className = "btn btn-primary">Create</button>
                                </div>
                            </div>
                        </div>


                    </div>
                </form>
                    <h2 className = "mt-5 text-center">Already have an account?</h2>
                    <div className="mt-3 w-100 d-flex justify-content-center">
                        <div className = "w-50 d-flex justify-content-center">
                            <button type = "button" className = "btn btn-primary w-50">Login</button>
                        </div>
                    </div>
            </div>

        </div>
    )
}

export default SignUpPage;