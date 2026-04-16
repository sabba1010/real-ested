// src/pages/Home/HowItWorks.jsx

const steps = [
  {
    step: "1",
    title: "Create an Account",
    desc: "Sign up as a user or agent with our simple registration.",
  },
  {
    step: "2",
    title: "Browse Properties",
    desc: "Explore verified listings based on your preferences and budget.",
  },
  {
    step: "3",
    title: "Make an Offer",
    desc: "Send offers to agents and complete your dream deal securely.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-green-600 font-semibold mb-3">
            Step-by-step process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">📣 How It Works</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A clear path to browse, choose, and complete your next property purchase.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item, index) => (
            <div
              key={index}
              className="text-center p-8 border border-slate-200 rounded-[1.75rem] bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
