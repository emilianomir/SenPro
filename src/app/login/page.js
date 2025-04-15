"use client";

import FormLayout from "@/components/FormLayout";
import { redirect } from "next/dist/server/api-utils";
import { useEffect, useState} from "react";
import { getUserSession} from "@/components/DBactions";
import Loading from "@/components/Loading";
import { useRouter } from 'next/navigation';

function LoginPage() {
const router = useRouter();
 const [yes, setyes] = useState(true);

    // Gets the session
    useEffect(() => {
      const fetchProducts = async () => {
        if (yes){
          try{
            setyes(false);
            let userName = await getUserSession();
            if(userName != null){
              router.push("/home");
            }
          } catch(error) {
              console.error("Error fetching DB:", error);
              alert("There was an issue getting the data.");
          } finally {
          }
        }
      }
      fetchProducts();
    }, [yes]);

    return (
      <div className="h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900">
        <FormLayout typeForm={{name: "Login", submit_name: "Login", text: "New Here?", link: "/signup", link_name: "Register"}} />
      </div>
    );
}

export default LoginPage;
