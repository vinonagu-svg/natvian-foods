import { useState } from 'react'
import bannerImage from '../assets/All-Products-banner.webp'

export default function About() {
  const [showMore, setShowMore] = useState(false)

  return (
    <section
      id="about"
      className="bg-white py-24 px-6 border-y border-gray-100"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        
        {/* IMAGE */}
        <div>
          <img
            src={bannerImage}
            alt="About Natvian Foods"
            className="rounded-[40px] shadow-2xl"
          />
        </div>

        {/* CONTENT */}
        <div>
          <p className="uppercase tracking-[4px] text-[#4F772D] font-semibold mb-4">
            About Us
          </p>

          <h2 className="text-5xl font-bold text-[#31572C] mb-8 leading-tight">
            Naturally Grown by Farmers, Delivered with Trust
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
  Natvian Foods is a farmer-driven initiative dedicated to bringing
  naturally grown traditional foods directly from farmers to families.
  We work closely with a trusted network of farmers who share our
  commitment to sustainable agriculture, natural cultivation, and
  wholesome nutrition.
</p>

          <button
            onClick={() => setShowMore(!showMore)}
            className="bg-[#4F772D] hover:bg-[#31572C] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition"
          >
            {showMore ? 'Show Less' : 'Explore More'}
          </button>

          {/* EXPAND CONTENT */}
          {showMore && (
            <div className="mt-12">

              {/* ABOUT DETAILS */}
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">

  <p>
    At <span className="font-semibold text-[#31572C]">Natvian Foods</span>,
    we are farmers ourselves, deeply connected to the land and committed to
    preserving traditional agricultural practices.
  </p>

  <p>
    Along with a trusted network of dedicated farmers, we cultivate and
    source naturally grown crops using sustainable and traditional farming
    methods. We believe healthy food begins with healthy soil and careful
    cultivation.
  </p>

  <p>
    Our goal is to create a direct bridge between farmers and consumers,
    ensuring that families receive authentic, naturally grown products
    while farmers receive fair value for their hard work.
  </p>

  <p>
    From native rice varieties and millets to pulses, health mixes,
    oils, and traditional food products, every item is carefully selected
    for its quality, purity, nutrition, and authenticity.
  </p>

  <p>
    By reducing unnecessary intermediaries, we bring farm-fresh goodness
    directly to your home while supporting local farming communities and
    promoting sustainable agriculture.
  </p>

  <p>
    Our mission is simple: to preserve traditional foods, empower farmers,
    and help families embrace healthier lifestyles through naturally grown,
    nutritious products.
  </p>
  </div>
  {/* STATS */}
<div className="grid md:grid-cols-3 gap-6 pt-6">

  <div className="bg-[#F8F7F2] p-6 rounded-3xl shadow-md text-center">
    <h3 className="text-3xl font-bold text-[#4F772D] mb-2">
      100%
    </h3>
    <p>Natural Ingredients</p>
  </div>

  <div className="bg-[#F8F7F2] p-6 rounded-3xl shadow-md text-center">
    <h3 className="text-3xl font-bold text-[#4F772D] mb-2">
      Farmers
    </h3>
    <p>Direct Network</p>
  </div>

  <div className="bg-[#F8F7F2] p-6 rounded-3xl shadow-md text-center">
    <h3 className="text-3xl font-bold text-[#4F772D] mb-2">
      Farm
    </h3>
    <p>To Family</p>
  </div>

</div>
              {/* FOUNDERS SECTION */}
              <div className="pt-16">
                <h3 className="text-3xl font-bold text-[#31572C] mb-8">
                  Founder & Leadership Team
                </h3>

                <div className="grid md:grid-cols-2 gap-8">

                  {/* FOUNDER */}
<div
  className="bg-[#F8F7F2] rounded-3xl p-6 pt-10 shadow-lg text-center 
  transition-all duration-500 ease-out 
  hover:-translate-y-3 hover:shadow-2xl"
>
  <img
    src="/nathiya.webp"
    alt="Nathiya V"
    className="w-40 h-40 object-cover rounded-full mx-auto mt-4 mb-5 shadow-lg"
  />

  <h4 className="text-2xl font-bold text-[#31572C]">
    Nathiya V
  </h4>

  <p className="text-[#4F772D] font-semibold mb-3">
  Founder
</p>

<p className="text-gray-600 leading-relaxed">
  Founder of Natvian Foods and a passionate advocate of traditional
  nutrition and natural wellness. Dedicated to promoting healthier
  lifestyles by bringing naturally grown foods and traditional food
  wisdom back to modern families.
</p>
</div>

{/* DIRECTOR */}
<div
  className="bg-[#F8F7F2] rounded-3xl p-6 pt-10 shadow-lg text-center 
  transition-all duration-500 ease-out 
  hover:-translate-y-3 hover:shadow-2xl"
>
  <img
    src="/vinoth.webp"
    alt="Vinothkumar Nagaraj"
    className="w-40 h-40 object-cover rounded-full mx-auto mt-4 mb-5 shadow-lg"
  />

  <h4 className="text-2xl font-bold text-[#31572C]">
    Vinothkumar Nagaraj
  </h4>

  <p className="text-[#4F772D] font-semibold mb-3">
    Director & Farmer
  </p>

  <p className="text-gray-600 leading-relaxed">
    Director of Natvian Foods and a dedicated farmer committed to
    sustainable agriculture and naturally grown produce. Passionate
    about creating a direct farm-to-family connection, ensuring that
    consumers receive authentic, nutritious foods while supporting the
    livelihoods of local farming communities.
  </p>
</div>                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  )
}