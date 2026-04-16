// src/pages/Home/Banner.jsx

import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <section
      className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://cdn.corporatefinanceinstitute.com/assets/real-estate.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 md:px-10 max-w-4xl">
          <span className="inline-flex items-center text-sm sm:text-base uppercase tracking-[0.3em] font-semibold text-green-300 mb-4">
            Trusted listings • Verified agents • Fast support
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-snug sm:leading-tight">
            Find Your Dream Home Today
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto text-slate-200">
            Browse through the best properties with verified agents and secure deals.
            Your ideal home is just a few clicks away.
          </p>
          <Link to="/properties">
            <button className="bg-green-500 hover:bg-green-600 transition px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-xl shadow-green-500/20">
              🏠 Explore Properties
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
