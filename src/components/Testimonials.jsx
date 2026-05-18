const testimonials = [
  {
    name: "Priya S",
    role: "Mumbai Customer",
    rating: 5,
    image: "/customers/priya.png",
    message:
      "Excellent quality products with authentic taste. Packaging was very neat and delivery was fast.",
  },
  {
    name: "Arun Kumar",
    role: "Bangalore Buyer",
    rating: 4.5,
    image: "/customers/arunkumar.png",
    message:
      "Really loved the natural ingredients. Feels healthy and fresh compared to other brands.",
  },
  {
    name: "Meena R",
    role: "Coimbatore Customer",
    rating: 5,
    image: "/customers/meena.png",
    message:
      "Very good product quality. My family enjoys it daily. Will definitely reorder again.",
  },
]

// ⭐ Star Rating Component
const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 !== 0

  return (
    <div className="flex items-center gap-1 text-[#90A955] text-xl">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i}>★</span>
      ))}

      {hasHalf && <span>⯪</span>}

      <span className="text-gray-500 text-sm ml-2">
        ({rating}/5)
      </span>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="uppercase tracking-[4px] text-[#4F772D] font-semibold mb-4">
          Testimonials
        </p>

        <h2 className="text-5xl font-bold text-[#31572C]">
          What Customers Say
        </h2>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Stars */}
            <Stars rating={item.rating} />

            {/* Message */}
            <p className="text-gray-600 leading-relaxed my-6 text-lg">
              {item.message}
            </p>

            {/* Profile */}
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover shadow-md"
              />

              <div>
                <h4 className="font-bold text-xl text-[#31572C]">
                  {item.name}
                </h4>

                <p className="text-gray-500">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}