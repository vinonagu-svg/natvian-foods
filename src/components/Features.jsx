const benefits = [
  '100% Natural',
  'Rich Nutrients',
  'No Preservatives',
  'Traditional Goodness',
]

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-4 gap-6">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition duration-300"
          >
            <div className="w-14 h-14 bg-[#4F772D] rounded-2xl flex items-center justify-center text-white text-2xl mb-5">
              ✓
            </div>

            <h3 className="text-xl font-bold text-[#31572C]">
              {item}
            </h3>
          </div>
        ))}
      </div>
    </section>
  )
}