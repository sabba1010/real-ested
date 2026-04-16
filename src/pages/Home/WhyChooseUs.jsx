// src/pages/Home/WhyChooseUs.jsx

const features = [
  {
    title: "Verified Listings",
    desc: "All properties are manually verified for quality and authenticity.",
  },
  {
    title: "Secure Payments",
    desc: "Trusted Stripe payment integration ensures safety and confidence.",
  },
  {
    title: "Responsive Support",
    desc: "Our team is available 24/7 to assist buyers, sellers, and agents.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-slate-950 text-white rounded-[2rem] shadow-2xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="rounded-[2rem] bg-slate-900/95 p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300 font-semibold mb-3">
              Why choose us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">🏆 Why Choose Us</h2>
            <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We combine verified listings, secure transactions, and responsive support so your property journey feels effortless.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-slate-900/90 p-7 rounded-[1.75rem] border border-white/10 shadow-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
