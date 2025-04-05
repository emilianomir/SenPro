import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";

export default function Account_Overlay(){
    const {userEmail} = useAppContext();
    const router = useRouter();
    const routeClick = () => {
        router.push("/account");
    }


    
    return(
        <div className="absolute top-25 w-2/15 right-20 z-20 rounded-lg bg-gray-800">
            <div className="grid grid-cols-1 text-gray-200 text-lg text-center py-3 flex">
                <div className="mb-3 pb-1 border-b-2 border-gray-300">Hi, {userEmail != null ? userEmail[0]: "User"}</div>
                
                <div className="w-full flex justify-center">
                    <div onClick={()=>router.push("/account")} className="mb-3 w-9/10 hover:rounded-lg hover:bg-gray-500">Account Settings</div>
                </div>
                <div className="w-full flex justify-center">
                    <div className="w-9/10 rounded-lg bg-gray-600 hover:bg-gray-700">Sign Out</div>
                </div>

            </div>

        </div>
    )
}