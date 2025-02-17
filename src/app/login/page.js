import 'bootstrap/dist/css/bootstrap.css';
import '../css/login_page.css';


function LoginPage(){
    return (

            <div className = "container">
                <div className = "row row-cols-2" >
                    <div className = "col title position-relative">  
                        <div className="position-absolute title_heading">
                            <h1 className = "text-white title_text">Login</h1>
                        </div>
                    </div>
                    <div className = "col position-relative">
                        <button type= "button" className='btn btn-primary h-25 w-50 position-absolute top-50 start-50 translate-middle-x'>Continue as Guest</button>
                    </div>
                </div>
                <div className = "container bg-secondary-subtle form_content ms-0">
                    <form>

                        <div className="mb-3">
                            <label htmlFor="inputEmail" className="form-label fs-3 mt-3">Username: </label>
                            <input type="email" placeholder="Enter your username" className="form-control" id="inputEmail" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputPass" className="form-label fs-3 ">Password: </label>
                            <div className = "row row-cols-2">
                                <div className="col-11">
                                    <input type="password" placeholder="Enter your password" className="form-control" id="inputPass" />
                                </div>
                                <div className="col-1">
                                    <div className="w-100 p-0">
                                       <button type="submit" className='btn btn-primary'>Login</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </form>
                        <h2 className = "mt-5 text-center">New here?</h2>
                        <div className="mt-3 w-100 d-flex justify-content-center">
                            <div className='w-50 d-flex justify-content-center'>
                                <button type = "button" className='btn btn-primary w-50' >Register</button>
                            </div>
                        </div>
                </div>

            </div>
                    
    )
}

export default LoginPage;