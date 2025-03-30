"use client";

import FormLayout from "@/components/FormLayout";

// import "../css/sign_up_page.css";
// import RouteButton from "@/components/route_button";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { addUser, testExistingUser } from "@/components/DBactions";
// import Link from "next/link";

function SignUpPage() {
  // const router = useRouter();
  // const [formData, changeFormData] = useState({
  //   inputEmail: "",
  //   inputPass: "",
  //   confirmPass: "",
  // });

  // const changeData = (event) => {
  //   const { id, value } = event.target;
  //   changeFormData((oldData) => ({
  //     ...oldData,
  //     [id]: value,
  //   }));
  // };

  // const submitForm = (event) => {
  //   event.preventDefault();
  //   if (!formData.inputEmail || !formData.inputPass || !formData.confirmPass) {
  //     alert("Please fill out all fields");
  //     return;
  //   }
  //   if (formData.inputPass != formData.confirmPass) {
  //     alert("Passwords are not the same");
  //     return;
  //   }

  //   //enter logic here for database searching of existing user
  //   testExistingUser(formData.inputEmail).then((data) => {
  //     if (data) {
  //       alert("Email already in use");
  //       return;
  //     } else {
  //       // getting username from email (username should be later provided)
  //       let userName;
  //       let other;
  //       [userName, other] = formData.inputEmail.split("@");
  //       userName = userName.toUpperCase();

  //         addUser(formData.inputEmail, userName,formData.inputPass, formData.inputAddress);
  //         router.push("/address?user=" + formData.inputEmail);
  //     }
  //   });
  // };

  return (
    <div className="h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900">
      <FormLayout typeForm={{name: "Register", submit_name: "Create", text: "Already have an account?", link: "/login", link_name: "Login", third: true}} />
      {/* <div className= "w-full h-full flex justify-center">
        <div className="border border-3 border-slate-500 mt-5 bg-gray-900/10">
          <h1 className="text-white text-center text-5xl pt-3 px-85 mt-4 mb-3">Register</h1>
          <div className="w-full flex justify-center">
            <div className="w-5/6 h-1 mt-0 bg-white opacity-75"></div>
          </div>
          <form className="mt-4  text-3xl/15" onSubmit={submitForm}>
            <div className="ml-10">
              <div className="grid grid-cols-1">
                <label htmlFor="inputEmail" className="form-label">
                  Username:{" "}
                </label>
                <input
                  value={formData.inputEmail}
                  onChange={changeData}
                  type="email"
                  placeholder="Enter your username"
                  className="form-control border-b-4 w-5/6"
                  id="inputEmail"
                  aria-describedby="emailHelp"
                />
              </div>

              <div className="grid grid-cols-1">
                <label htmlFor="inputPass" className="form-label fs-3 ">
                  Password:{" "}
                </label>
                <input
                  value={formData.inputPass}
                  type="password"
                  onChange={changeData}
                  placeholder="Enter your password"
                  className="form-control border-b-4 w-5/6"
                  id="inputPass"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPass" className="form-label fs-3 ">
                  Confirm Password:{" "}
                </label>
                <div className="grid grid-cols-1">
                  <div>
                    <input
                      value={formData.confirmPass}
                      onChange={changeData}
                      type="password"
                      placeholder="Re-enter your password"
                      className="form-control border-b-4 w-5/6"
                      id="confirmPass"
                    />
              </div>
            </div>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <button type="submit" className="mt-5 px-5 outline-2 outline-white w-1/2">
                Create
              </button>
            </div>
          </form>
          <h2 className="mt-10 text-center text-3xl">Already have an account?</h2>
          <div className="mt-5 w-full flex justify-center">
            <div className="w-1/3 p-0">
              <Link href = "/login" passHref>
                <button type="button"  className="px-3 py-3 text-2xl rounded border-1 border-solid btn-lg w-full border-white">Login</button>
              </Link>
            </div>
          </div>

        </div>
      </div> */}
    </div>
  );
}

export default SignUpPage;
