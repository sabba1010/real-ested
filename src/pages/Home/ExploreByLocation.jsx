// src/pages/Home/ExploreByLocation.jsx

const locations = [
  {
    city: "Dhaka",
    image: "https://i.ibb.co/J5gNdP6/dhaka.jpg",
    count: 120,
  },
  {
    city: "Chattogram",
    image: "https://i.ibb.co/WPb2LpN/chattogram.jpg",
    count: 80,
  },
  {
    city: "Sylhet",
    image: "https://i.ibb.co/HHrBbjz/sylhet.jpg",
    count: 60,
  },
];

const ExploreByLocation = () => {
  return (
    <section className="py-12 px-4 md:px-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8">🗺️ Explore by Location</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {locations.map((loc, index) => (
          <div
            key={index}
            className="relative rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={loc.image}
              alt={loc.city}
              className="w-full h-52 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-4">
              <h3 className="text-2xl font-semibold">{loc.city}</h3>
              <p className="mt-1">{loc.count} properties</p>
              <button className="mt-3 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition">
                View Properties
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreByLocation;
