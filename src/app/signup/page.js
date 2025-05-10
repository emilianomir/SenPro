"use client";

import FormLayout from "@/components/FormLayout";


function SignUpPage() {


  return (
    <div className="h-screen bg-gradient-to-r from-gradient-lr via-gradient-m to-gradient-lr">
      <FormLayout typeForm={{name: "Register", submit_name: "Create", text: "Already have an account?", link: "/login", link_name: "Login", third: true}} />
    </div>
  );
}

export default SignUpPage;
