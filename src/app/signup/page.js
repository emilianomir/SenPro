"use client";

import FormLayout from "@/components/FormLayout";


function SignUpPage() {


  return (
    <div className="h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900">
      <FormLayout typeForm={{name: "Register", submit_name: "Create", text: "Already have an account?", link: "/login", link_name: "Login", third: true}} />
    </div>
  );
}

export default SignUpPage;
