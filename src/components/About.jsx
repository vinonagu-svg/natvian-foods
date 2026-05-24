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
            Bringing Traditional Nutrition Back To Everyday Life
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Natvian Foods focuses on natural wellness products inspired by
            traditional recipes and healthy living.
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
                  we believe healthy food begins with healthy soil. 
                  We are farmers with our own agricultural land, deeply connected 
                  to nature and traditional farming practices.
                </p>

                <p>
                  We naturally cultivate our crops using traditional and organic 
                  farming methods without harmful chemicals or artificial additives. 
                  Every ingredient is carefully grown and selected to preserve its 
                  natural nutrition, purity, and authentic taste.
                </p>

                <p>
                  Our mission is to bring wholesome traditional foods back into 
                  modern lifestyles through millet-based health mixes, nutritious 
                  products, and naturally prepared foods inspired by our heritage.
                </p>

                <p>
                  From our farms to your family, every product reflects our 
                  commitment to quality, sustainability, wellness, and trust.
                </p>

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
                      Organic
                    </h3>
                    <p>Traditional Farming</p>
                  </div>

                  <div className="bg-[#F8F7F2] p-6 rounded-3xl shadow-md text-center">
                    <h3 className="text-3xl font-bold text-[#4F772D] mb-2">
                      Trusted
                    </h3>
                    <p>Traditional Recipes</p>
                  </div>

                </div>
              </div>

              {/* FOUNDERS SECTION */}
              <div className="pt-16">
                <h3 className="text-3xl font-bold text-[#31572C] mb-8">
                  Meet Our Founders
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
                      alt="Founder Nathiya V"
                      className="w-40 h-40 object-cover rounded-full mx-auto mt-4 mb-5 shadow-lg"
                    />

                    <h4 className="text-2xl font-bold text-[#31572C]">
                      Nathiya V, MA, BEd Tamil
                    </h4>

                    <p className="text-[#4F772D] font-semibold mb-3">
                      Founder
                    </p>

                    <p className="text-gray-600">
                      Passionate about natural wellness, traditional nutrition,
                      and bringing healthy food habits back to families.
                    </p>
                  </div>

                  {/* CO-FOUNDER */}
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
                      Vinothkumar Nagaraj, B-Tech Mech
                    </h4>

                    <p className="text-[#4F772D] font-semibold mb-3">
                      Co-Founder & Managing Director
                    </p>

                    <p className="text-gray-600">
                      Dedicated to sustainable farming, innovation, and delivering
                      naturally grown nutritious foods to every home.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  )
}