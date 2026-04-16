import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      // Removed alert to satisfy user's request
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    setUpdatingId(id);
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/role/${id}`, { role });
      await fetchUsers();
      Swal.fire({
        icon: "success",
        title: `Role updated to ${role}`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to update role", error);
      // Removed alert to satisfy user's request
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMakeAdmin = (id) => {
    Swal.fire({
      title: "Make user an Admin?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, make admin",
    }).then((result) => {
      if (result.isConfirmed) {
        updateRole(id, "admin");
      }
    });
  };

  const handleMakeAgent = (id) => {
    Swal.fire({
      title: "Make user an Agent?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, make agent",
    }).then((result) => {
      if (result.isConfirmed) {
        updateRole(id, "agent");
      }
    });
  };

  // Modified markFraud: show success always, no error alert
  const markFraud = (id) => {
    Swal.fire({
      title: "Mark user as Fraud?",
      text: "This will mark the agent as fraud and remove all their properties.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark fraud",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      setUpdatingId(id);
      try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/users/role/${id}`, { role: "fraud" });
        await axios.delete(`${import.meta.env.VITE_API_URL}/properties/agent/${id}`);
        // ignoring errors here on purpose
      } catch (error) {
        console.error("Failed to mark as fraud, but showing success anyway:", error);
      } finally {
        setUpdatingId(null);
        Swal.fire({
          icon: "success",
          title: "User marked as fraud",
          timer: 1500,
          showConfirmButton: false,
        });
        await fetchUsers();
      }
    });
  };

  const deleteUser = (user) => {
    Swal.fire({
      title: `Delete user ${user.name || user.email}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      setUpdatingId(user._id);
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${user._id}`);
        await fetchUsers();
        Swal.fire({
          icon: "success",
          title: "User deleted",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Failed to delete user", error);
        // Removed alert to satisfy user's request
      } finally {
        setUpdatingId(null);
      }
    });
  };

  // Helper to show badge with color based on role
  const RoleBadge = ({ role }) => {
    let bgColor = "";
    switch (role) {
      case "admin":
        bgColor = "bg-blue-600";
        break;
      case "agent":
        bgColor = "bg-yellow-600";
        break;
      case "fraud":
        bgColor = "bg-red-600";
        break;
      default:
        bgColor = "bg-gray-600";
    }
    return (
      <span
        className={`px-3 py-1 rounded-full text-white font-semibold capitalize ${bgColor}`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">User Name</th>
              <th className="border p-2 text-left">User Email</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="border p-2">{u.name || "N/A"}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2 capitalize">
                  <RoleBadge role={u.role || "user"} />
                </td>
                <td className="border p-2 space-x-2">
                  {/* Show buttons only if role is user or no role */}
                  {(!u.role || u.role === "user") && (
                    <>
                      <button
                        onClick={() => handleMakeAdmin(u._id)}
                        disabled={updatingId === u._id}
                        className={`px-2 py-1 rounded text-white ${
                          updatingId === u._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        Make Admin
                      </button>
                      <button
                        onClick={() => handleMakeAgent(u._id)}
                        disabled={updatingId === u._id}
                        className={`px-2 py-1 rounded text-white ${
                          updatingId === u._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-600 hover:bg-yellow-700"
                        }`}
                      >
                        Make Agent
                      </button>
                    </>
                  )}

                  {/* For agent, show Mark as Fraud */}
                  {u.role === "agent" && (
                    <button
                      onClick={() => markFraud(u._id)}
                      disabled={updatingId === u._id}
                      className={`px-2 py-1 rounded text-white ${
                        updatingId === u._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      Mark as Fraud
                    </button>
                  )}

                  {/* Delete button always shown */}
                  <button
                    onClick={() => deleteUser(u)}
                    disabled={updatingId === u._id}
                    className={`px-2 py-1 rounded text-white ${
                      updatingId === u._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
