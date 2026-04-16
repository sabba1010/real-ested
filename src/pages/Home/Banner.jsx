// src/pages/Home/Banner.jsx

import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <section
      className="relative min-h-[75vh] sm:min-h-[85vh] md:min-h-[95vh] bg-cover bg-center bg-no-repeat overflow-hidden rounded-[2rem] shadow-2xl"
      style={{
        backgroundImage:
          "url('https://cdn.corporatefinanceinstitute.com/assets/real-estate.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.35),_transparent_35%)]" />
      <div className="relative z-10 flex min-h-[75vh] items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl w-full flex h-full flex-col items-center justify-center pt-20">
          <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/20 px-4 py-2 text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-emerald-200 mb-5">
            Trusted listings • Verified agents • Fast support
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
            Find Your Dream Home Today
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto text-slate-200/90 leading-relaxed">
            Browse the best verified properties, compare offers clearly, and connect with trusted agents. Your next home search is now faster, safer, and more beautiful.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/properties">
              <button className="inline-flex items-center justify-center rounded-full bg-green-500 px-8 py-3 text-base font-semibold text-white shadow-xl shadow-green-500/25 transition hover:bg-green-600">
                🏠 Explore Properties
              </button>
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/15">
              Sign in to save favorites
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              "Verified listings",
              "Secure payments",
              "Fast agent support",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
