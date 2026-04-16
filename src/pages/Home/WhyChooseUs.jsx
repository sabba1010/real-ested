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
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-green-600 font-semibold mb-3">
            Why choose us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">🏆 Why Choose Us</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-[1.5rem] shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
