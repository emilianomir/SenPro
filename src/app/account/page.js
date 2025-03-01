"use client"
import { useRouter } from "next/navigation"
export default function Account(){
    const router = useRouter();
    return (
        <div className="container">
            <div>
                <button className="btn btn-primary" onClick={()=>router.back()}>Back</button>
            </div>
            <div className="container">
                <div className="text-center mb-5 border-bottom"><h1 className="fs-1 text-white fw-bolder">Hi User!</h1></div>
                <div className="row row-cols-2">
                    <div className="col-2 m-0 p-0">
                        <div className="row row-cols-1 w-100 m-0 p-0">
                            <div className="col w-100 m-0 p-0 pb-1">
                                <button className="btn btn-primary w-100">Settings</button>
                            </div>
                            <div className="col w-100 m-0 p-0 pb-1 mb-5">
                                <button className = "btn btn-dark w-100">Reviews</button>
                            </div>

                        </div>
                    </div>
                    <div className="col-10 bg-secondary-subtle m-0 p-0">
                        <div className="container">
                            <h2 className="text-center pt-4">Account Settings</h2>
                            <div className="row row-cols-1">
                                <div className="col ps-5 fs-2 mt-4">
                                    UserName: User
                                </div>
                                <div className="col ps-5 fs-2 mt-4 text-info">
                                    Change Password
                                </div>
                                <div className="col ps-5 fs-2 mt-4">
                                    Default Zip Code: 78577
                                </div>
                                <div className="col ps-5 fs-2 mt-4">
                                    Address: 12345 Hill Rd, Pharr TX
                                </div>

                                <div className="col w-25 ps-5 mt-5 pb-5 h-100">
                                    <button className="btn btn-danger w-100 fs-3 h-100">Log Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    )
}