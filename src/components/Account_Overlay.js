import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";

export default function Account_Overlay(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const routeClick = () => {

        const search = searchParams.get('user');
        router.push("/account?user=" + search);
    }


    
    return(
        <div className="position-absolute top-20 end-5 w-25 h-40 d-flex justify-content-end">
            <div className="bg-secondary-subtle w-25 h-75 text-center row row-cols-1 border border-white border-4 rounded">
                <div className="col ">Hi, User</div>
                <button onClick={routeClick} className = "btn btn-primary w-100">
                    <div className="col">Account Settings</div>
                </button>
                <div className="col">Sign Out</div>
            </div>

        </div>
    )
}