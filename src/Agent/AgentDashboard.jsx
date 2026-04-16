// src/layouts/AgentDashboard.jsx
import React, { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-6 bg-gray-50 flex flex-col">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-primary drawer-button lg:hidden mb-4"
        >
          Open Menu
        </label>

        <div className="bg-white rounded shadow-md p-6 flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side bg-green-100 text-green-800 font-semibold">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full">
          <div className="mb-6 text-center">
            <img
              src={user?.photoURL || "https://i.ibb.co/tKH0RmS/avatar.png"}
              alt="Agent"
              className="w-20 h-20 rounded-full mx-auto border border-green-500"
            />
            <h2 className="text-lg mt-2">{user?.displayName || "Agent"}</h2>
            <p className="text-sm text-green-600">{user?.email}</p>
          </div>

          <li>
            <Link to="/agent-dashboard">Dashboard Home</Link>
          </li>
          <li>
            <Link to="/agent-dashboard/profile">Agent Profile</Link>
          </li>
          <li>
            <Link to="/agent-dashboard/add-property">Add Property</Link>
          </li>
          <li>
            <Link to="/agent-dashboard/my-properties">My Added Properties</Link>
          </li>
          <li>
            <Link to="/agent-dashboard/my-sold-properties">My Sold Properties</Link>
          </li>
          <li>
            <Link to="/agent-dashboard/requested-properties">Requested Properties</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AgentDashboard;



// import { Outlet, Link } from "react-router-dom";
// import { getAuth } from "firebase/auth";

// const AgentDashboard = () => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   return (
//     <div className="drawer lg:drawer-open min-h-screen">
//       <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
//       <div className="drawer-content p-6 bg-gray-50 flex flex-col">
//         <label
//           htmlFor="dashboard-drawer"
//           className="btn btn-primary drawer-button lg:hidden mb-4"
//         >
//           Open Menu
//         </label>

//         <div className="bg-white rounded shadow-md p-6 flex-grow overflow-auto">
//           <Outlet />
//         </div>
//       </div>

//       <div className="drawer-side bg-green-100 text-green-800 font-semibold">
//         <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
//         <ul className="menu p-4 w-64 min-h-full">
//           <div className="mb-6 text-center">
//             <img
//               src={user?.photoURL || "https://i.ibb.co/tKH0RmS/avatar.png"}
//               alt="Agent"
//               className="w-20 h-20 rounded-full mx-auto border border-green-500"
//             />
//             <h2 className="text-lg mt-2">{user?.displayName || "Agent"}</h2>
//             <p className="text-sm text-green-600">{user?.email}</p>
//           </div>

//           <li>
//             <Link to="/agent-dashboard">Dashboard Home</Link>
//           </li>
//           <li>
//             <Link to="/agent-dashboard/profile">Agent Profile</Link>
//           </li>
//           <li>
//             <Link to="/agent-dashboard/add-property">Add Property</Link>
//           </li>
//           <li>
//             <Link to="/agent-dashboard/my-properties">My Added Properties</Link>
//           </li>
//           <li>
//             <Link to="/agent-dashboard/my-sold-properties">My Sold Properties</Link>
//           </li>
//           <li>
//             <Link to="/agent-dashboard/requested-properties">Requested Properties</Link>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AgentDashboard;
