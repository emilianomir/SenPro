import Link from "next/link"

export default function Account_Overlay(){
    return(
        <div className="position-absolute top-20 end-5 w-25 h-40 d-flex justify-content-end">
            <div className="bg-secondary-subtle w-25 h-75 text-center row row-cols-1 border border-white border-4 rounded">
                <div className="col ">Hi, User</div>
                <Link href = "/account">
                    <div className="col">Account Settings</div>
                </Link>
                <div className="col">Sign Out</div>
            </div>

        </div>
    )
}