// src/components/Hero.jsx

import LeftHero from './LeftHero'
import RightHero from './RightHero'

export default function Hero({
  language,
  MurungabannerImage,
  BananabannerImage,
}) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-[#F8F7F2] via-[#eef4e7] to-[#dce8cf]"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-14 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE */}
        <LeftHero language={language} />

        {/* RIGHT SIDE */}
        <RightHero
          MurungabannerImage={MurungabannerImage}
          BananabannerImage={BananabannerImage}
        />
      </div>

      {/* BOTTOM STRIP */}
      <div className="bg-gradient-to-r from-[#1f4d1f] to-[#31572C] py-5 mt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-10 text-white text-sm md:text-lg font-medium">
          <span>🌿 Natural Ingredients</span>
          <span>🥣 Traditional Goodness</span>
          <span>💚 Modern Lifestyle</span>
        </div>
      </div>
    </section>
  )
}