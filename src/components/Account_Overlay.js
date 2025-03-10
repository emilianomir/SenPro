import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";

export default function Account_Overlay(){
    const {userEmail} = useAppContext();
    const router = useRouter();
    const routeClick = () => {
        router.push("/account");
    }


    
    return(
        <div className="position-absolute top-20 end-5 w-25 h-40 d-flex justify-content-end">
            <div className="bg-secondary-subtle w-25 h-100 text-center row row-cols-1 border border-white border-4 rounded">
                <div className="col ">Hi, {userEmail != null ? userEmail[0]: "User"}</div>
                <button onClick={routeClick} className = "btn btn-primary w-100">
                    <div className="col">Account Settings</div>
                </button>
                <div className="col">Sign Out</div>
            </div>

        </div>
    )
}