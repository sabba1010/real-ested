const highlights = [
  {
    title: "Verified Homes",
    description: "Only authentic listings are shown with full review history and agent verification.",
  },
  {
    title: "Fast Responses",
    description: "Get matched with local agents quickly and schedule viewings in minutes.",
  },
  {
    title: "Safe Transactions",
    description: "Stripe-powered payments and secure booking flows keep every deal protected.",
  },
];

const PlatformHighlights = () => {
  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-[2fr_1fr] items-center">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 shadow-2xl">
          <div className="p-8 md:p-12 lg:p-16">
            <span className="inline-flex items-center rounded-full bg-green-600/20 text-green-200 text-sm font-semibold px-4 py-2 mb-6">
              Trusted real estate experience
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Discover modern homes with a cleaner, faster experience.
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-8">
              Browse premium listings, compare prices, and connect with verified agents from one polished dashboard.
              Every step is designed to keep your search simple and your next move confident.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 shadow-lg">
                <p className="text-sm uppercase tracking-[0.2em] text-green-300 mb-3">Smart search</p>
                <p className="text-white font-medium">Filter by location, price, and agent experience with fast results.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 shadow-lg">
                <p className="text-sm uppercase tracking-[0.2em] text-green-300 mb-3">Complete support</p>
                <p className="text-white font-medium">Receive expert guidance from property agents and customer care.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {highlights.map((item, index) => (
            <div key={index} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:border-green-500/30">
              <div className="text-sm uppercase tracking-[0.2em] text-green-300 mb-4">Feature {index + 1}</div>
              <h3 className="text-2xl font-semibold mb-3 text-white">{item.title}</h3>
              <p className="text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
          <div className="rounded-[2rem] bg-gradient-to-r from-green-600 to-cyan-500 p-6 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-3">Get started in seconds</h3>
            <p className="text-slate-900">Sign up, browse properties, and send your first offer with a clean, smooth flow.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformHighlights;
