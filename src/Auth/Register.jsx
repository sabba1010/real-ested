import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Player } from "@lottiefiles/react-lottie-player";
import registerAnimation from "../assets/register.json";
import AuthContext from "../contexts/AuthContext";

import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import axios from "axios";

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);

      // 1. Create user with email and password
      const userCredential = await createUser(data.email, data.password);

      // 2. Update Firebase profile
      await updateProfile(userCredential.user, {
        displayName: data.fullName,
        photoURL: data.photoURL || "https://i.ibb.co/placeholder.png",
      });

      // 3. Prepare user data to save in backend
      const userInfo = {
        name: data.fullName,
        email: data.email,
        photoURL: data.photoURL || "https://i.ibb.co/placeholder.png",
        role: data.role,
      };

      console.log("User info to send:", userInfo);

      // 4. Save user info to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);

      // 5. Show success alert
      await Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text:
          userInfo.role === "agent"
            ? "Welcome Agent! The page will reload shortly..."
            : "Welcome User! The page will reload shortly...",
        timer: 2000,
        showConfirmButton: false,
      });

      reset();

      // 6. Reload page and redirect to route based on role
      if (userInfo.role === "agent") {
        window.location.href = "/agent-dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
      setError("firebase", { type: "manual", message: error.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="md:w-1/2 w-full flex justify-center mb-8 md:mb-0">
        <Player autoplay loop src={registerAnimation} className="w-80 h-80" />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              {...register("fullName", { required: "Full Name is required" })}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <input
              type="url"
              {...register("photoURL")}
              placeholder="Enter your photo URL (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Register As</label>
            <select
              {...register("role", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              defaultValue="user"
            >
              <option value="user">User</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          {/* Firebase error */}
          {errors.firebase && (
            <p className="text-red-600 text-center">{errors.firebase.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;





// import React, { useContext } from "react";
// import { useForm } from "react-hook-form";
// import { Player } from "@lottiefiles/react-lottie-player";
// import registerAnimation from "../assets/register.json";
// import AuthContext from "../contexts/AuthContext";

// import { updateProfile } from "firebase/auth";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Register = () => {
//   const { createUser } = useContext(AuthContext);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     setError,
//     formState: { errors },
//   } = useForm();
//   const navigate = useNavigate();
//   const password = watch("password", "");

//   const onSubmit = async (data) => {
//     try {
//       console.log("Form data:", data); // Debug log for role

//       // 1. Create user with email and password
//       const userCredential = await createUser(data.email, data.password);

//       // 2. Update Firebase profile
//       await updateProfile(userCredential.user, {
//         displayName: data.fullName,
//         photoURL: data.photoURL || "https://i.ibb.co/placeholder.png",
//       });

//       // 3. Prepare user data to save in backend
//       // NOTE: NO default role here! Use exactly data.role from form.
//       const userInfo = {
//         name: data.fullName,
//         email: data.email,
//         photoURL: data.photoURL || "https://i.ibb.co/placeholder.png",
//         role: data.role, // <-- Use exactly selected role from form
//       };

//       console.log("User info to send:", userInfo); // Debug log

//       // 4. Save user info to backend
//       await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);

//       // 5. Show success alert and redirect
//       if (userInfo.role === "agent") {
//         await Swal.fire({
//           icon: "success",
//           title: "Registration Successful",
//           text: "Welcome Agent! Redirecting to Agent Dashboard...",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         navigate("/agent-dashboard"); // Adjust route as needed
//       } else {
//         await Swal.fire({
//           icon: "success",
//           title: "Registration Successful",
//           text: "Welcome User! Redirecting to Home page...",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         navigate("/"); // Adjust route as needed
//       }

//       reset();
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         icon: "error",
//         title: "Registration Failed",
//         text: error.message,
//       });
//       setError("firebase", { type: "manual", message: error.message });
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
//       <div className="md:w-1/2 w-full flex justify-center mb-8 md:mb-0">
//         <Player autoplay loop src={registerAnimation} className="w-80 h-80" />
//       </div>

//       <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3">
//         <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
//           Register
//         </h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Full Name</label>
//             <input
//               type="text"
//               {...register("fullName", { required: "Full Name is required" })}
//               placeholder="Enter your full name"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             {errors.fullName && (
//               <p className="text-red-500 text-sm">{errors.fullName.message}</p>
//             )}
//           </div>

//           {/* Photo URL */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Photo URL</label>
//             <input
//               type="url"
//               {...register("photoURL")}
//               placeholder="Enter your photo URL (optional)"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Email</label>
//             <input
//               type="email"
//               {...register("email", { required: "Email is required" })}
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Password</label>
//             <input
//               type="password"
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters",
//                 },
//               })}
//               placeholder="Enter your password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//               autoComplete="new-password"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm">{errors.password.message}</p>
//             )}
//           </div>

//           {/* Role Selection */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Register As</label>
//             <select
//               {...register("role", { required: true })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//               defaultValue="user"
//             >
//               <option value="user">User</option>
//               <option value="agent">Agent</option>
//             </select>
//           </div>

//           {/* Firebase error */}
//           {errors.firebase && (
//             <p className="text-red-600 text-center">{errors.firebase.message}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCc0LD6o14sM4lDAgkQ-9rYzx6Bb2AuV1Q",
//   authDomain: "real-state-b8e2f.firebaseapp.com",
//   projectId: "real-state-b8e2f",
//   storageBucket: "real-state-b8e2f.firebasestorage.app",
//   messagingSenderId: "244156891210",
//   appId: "1:244156891210:web:b7c769532f7c98164f26b3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);