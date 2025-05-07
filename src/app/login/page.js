"use client";

import FormLayout from "@/components/FormLayout";

function LoginPage() {


    return (
      <div className="h-screen bg-gradient-to-r from-gradient-lr via-gradient-m to-slate-gradient-lr">
        <FormLayout typeForm={{name: "Login", submit_name: "Login", text: "New Here?", link: "/signup", link_name: "Register"}} />
      </div>
    );
}

export default LoginPage;
