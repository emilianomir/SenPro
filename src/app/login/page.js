"use client";

import FormLayout from "@/components/FormLayout";

function LoginPage() {


    return (
      <div className="h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900">
        <FormLayout typeForm={{name: "Login", submit_name: "Login", text: "New Here?", link: "/signup", link_name: "Register"}} />
      </div>
    );
}

export default LoginPage;
