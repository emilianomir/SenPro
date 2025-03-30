"use client";


import "../css/login_page.css";
// import RouteButton from "@/components/route_button";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useAppContext } from "@/context";
import FormLayout from "@/components/FormLayout";

function LoginPage() {
  // const {setUserEmail} = useAppContext();
  // const router = useRouter();
  // const [formData, changeFormData] = useState({
  //   inputEmail: "",
  //   inputPass: "",
  // });


  // const changeData = (event) => {
  //   const { id, value } = event.target;
  //   changeFormData((oldData) => ({
  //     ...oldData,
  //     [id]: value,
  //   }));
  // };

  //   const submitForm = (event) => {
  //     event.preventDefault();
  //     // Checking Login Credentials
  //     checkLogin(formData.inputEmail, formData.inputPass).then((data) => {
  //       if (!data) {
  //         alert("Invalid email or pass");
  //         return;
  //       } else {
  //         let userName = formData.inputEmail.split('@')[0].toUpperCase();
  //         setUserEmail([userName, formData.inputEmail]);
  //         router.push("/home");
  //       }
  //     });
  //   };

    return (
      <div className="h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900">
        <FormLayout typeForm={{name: "Login", submit_name: "Login", text: "New Here?", link: "/signup", link_name: "Register"}} />
      </div>

      // <div className="bg-secondary full_content">
      //   <div className="container">
      //     <div className="row row-cols-2">
      //       <div className="col title position-relative">
      //         <div className="position-absolute title_heading">
      //           <h1 className="text-white title_text">Login</h1>
      //         </div>
      //       </div>
      //       <div className="col position-relative">
      //         <div className="position-absolute top-50 start-50 translate-middle-x" onClick={()=> setUserEmail(null)}>
      //           <RouteButton name="Continue as Guest" location="/address" />
      //         </div>
      //       </div>
      //     </div>
      //     <div className="container bg-secondary-subtle form_content ms-0">
      //       <form onSubmit={submitForm}>
      //         <div className="mb-3">
      //           <label htmlFor="inputEmail" className="form-label fs-3 mt-3">
      //             Username:{" "}
      //           </label>
      //           <input
      //             type="email"
      //             value={formData.inputEmail}
      //             onChange={changeData}
      //             placeholder="Enter your username"
      //             className="form-control"
      //             id="inputEmail"
      //             aria-describedby="emailHelp"
      //           />
      //         </div>
      //         <div className="mb-3">
      //           <label htmlFor="inputPass" className="form-label fs-3 ">
      //             Password:{" "}
      //           </label>
      //           <div className="row row-cols-2">
      //             <div className="col-11">
      //               <input
      //                 type="password"
      //                 value={formData.inputPass}
      //                 onChange={changeData}
      //                 placeholder="Enter your password"
      //                 className="form-control"
      //                 id="inputPass"
      //               />
      //             </div>
      //             <div className="col-1">
      //               <div className="w-100 p-0">
      //                 <button type="submit" className="btn btn-primary">
      //                   Login
      //                 </button>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </form>
      //       <h2 className="mt-5 text-center">New here?</h2>
      //       <div className="mt-3 w-100 d-flex justify-content-center">
      //         <div className="w-50 d-flex justify-content-center">
      //           <RouteButton name="Register" location="/signup" />
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
}

export default LoginPage;
