import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import AuthContext from "../contexts/AuthContext";

const AddNewProperty = () => {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Agent info initially set from logged-in user, otherwise empty
  const [agentName, setAgentName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");

  // User load hole agent info set koro ekbar
  useEffect(() => {
    if (user) {
      setAgentName(user.displayName || "");
      setAgentEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !location || !imageUrl || !priceRange || !agentName || !agentEmail) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all fields including image URL and agent info.",
        confirmButtonColor: "#1e40af",
        background: "#f8fafc",
      });
      return;
    }

    const propertyInfo = {
      title,
      location,
      priceRange,
      imageUrl,
      agentName,
      agentEmail,
      status: "available",
      createdAt: new Date(),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyInfo),
      });

      const data = await res.json();

      if (data.insertedId || data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Property added successfully!",
          confirmButtonColor: "#1e40af",
          background: "#f8fafc",
        });
        // Clear form
        setTitle("");
        setLocation("");
        setPriceRange("");
        setImageUrl("");
        // Agent info reset if user info changes
        setAgentName(user?.displayName || "");
        setAgentEmail(user?.email || "");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to add property!",
          confirmButtonColor: "#1e40af",
          background: "#f8fafc",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
        confirmButtonColor: "#1e40af",
        background: "#f8fafc",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white rounded-3xl shadow-xl mt-16 font-sans">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 tracking-tight">
        Add New Property
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Property Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded"
        />

        <input
          type="text"
          placeholder="Property Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded"
        />

        <input
          type="text"
          placeholder="Price Range (e.g. $100k - $150k)"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded"
        />

        <input
          type="url"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded"
        />

        <input
          type="text"
          placeholder="Agent Name"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          required
          readOnly={!!user?.displayName}
          className={`w-full px-4 py-3 border rounded ${user?.displayName ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />

        <input
          type="email"
          placeholder="Agent Email"
          value={agentEmail}
          onChange={(e) => setAgentEmail(e.target.value)}
          required
          readOnly={!!user?.email}
          className={`w-full px-4 py-3 border rounded ${user?.email ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Property
        </button>
      </form>
    </div>
  );
};

export default AddNewProperty;
