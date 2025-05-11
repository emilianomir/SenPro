import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { deleteUserSession } from "./DBactions";

export default function Account_Overlay(){
    const {userEmail, setNumberPlaces, setFavorites} = useAppContext();
    const router = useRouter();
    const routeClick =  async () => {
        if (await deleteUserSession(userEmail[1]) != 'pending') {
            setNumberPlaces(0);
            setFavorites(null);
            router.push("/");
        } 
    }


    
    return(
        <div className="absolute top-20 md:top-30 lg:top-25 w-2/5 md:w-1/5 lg:w-2/15 right-1 md:right-20 z-30 rounded-lg bg-account-o-bg w-1/2 ">
            <div className="grid grid-cols-1 text-account-o-text text-base md:text-lg text-center py-3 flex">
                <div className="mb-3 pb-1 border-b-2 border-gray-300">Hi, {userEmail != null ? userEmail[0]: "User"}</div>
                
                <div className="w-full flex justify-center">
                    <div onClick={()=>router.push("/account")} className="mb-3 w-9/10 hover:rounded-lg hover:bg-account-o-hover">Account Settings</div>
                </div>
                <div className="w-full flex justify-center">
                    <div onClick={routeClick} className="cursor-pointer w-9/10 rounded-lg text-white bg-red-600 hover:bg-red-700">Sign Out</div>
                </div>

            </div>

        </div>
    )
}