// src/pages/Home/TopAgents.jsx
import { FaStar } from "react-icons/fa";

const agents = [
  {
    name: "Salma Akter",
    rating: 4.9,
    properties: 34,
    image: "https://i.ibb.co/ZfP6twV/agent1.jpg",
  },
  {
    name: "Tanvir Hossain",
    rating: 4.8,
    properties: 27,
    image: "https://i.ibb.co/9pp5VXy/agent2.jpg",
  },
  {
    name: "Mahi Rahman",
    rating: 4.7,
    properties: 30,
    image: "https://i.ibb.co/xYFFTVm/agent3.jpg",
  },
];

const TopAgents = () => {
  return (
    <section className="py-12 px-4 md:px-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">🔥 Top Rated Agents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <img
              src={agent.image}
              alt={agent.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-center">{agent.name}</h3>
            <div className="flex items-center justify-center text-yellow-500 mt-2">
              <FaStar /> <span className="ml-1">{agent.rating}</span>
            </div>
            <p className="text-center text-gray-500 mt-1">
              {agent.properties} properties handled
            </p>
            <button className="block mt-4 mx-auto bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopAgents;
