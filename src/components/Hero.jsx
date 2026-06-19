// src/components/Hero.jsx

import LeftHero from "./LeftHero";
import RightHero from "./RightHero";

import HeroProductsImage from "../assets/hero-products.webp";
import FarmBackground from "../assets/farm-background.webp";

export default function Hero({ language }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={FarmBackground}
          alt="Farm Background"
          className="w-full h-full object-cover"
        />

        {/* Light overlay */}
        <div className="absolute inset-0 bg-[#f8f7f2]/60" />
      </div>

      {/* Hero Content */}
      <div
        className="
          relative z-10
          max-w-[1700px]
          mx-auto
          px-6
          py-8 md:py-10
          grid
          lg:grid-cols-[1fr_1.1fr]
          gap-6
          items-start
        "
      >
        {/* Left Content */}
        <LeftHero language={language} />

        {/* Right Banner */}
        <div
  className="relative"
  style={{ top: "40px" }}
>
  <RightHero HeroProductsImage={HeroProductsImage} />
</div>
      </div>
{/* Trust Badges */}
<div className="relative z-10 px-6 pb-6">
  <div className="max-w-7xl mx-auto">
    <div
      className="
        flex
        flex-wrap
        justify-center
        gap-3
      "
    >
      <span className="bg-white px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
        🌿 100% Natural Ingredients
      </span>

      <span className="bg-white px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
        🌾 Millet-Based Nutrition
      </span>

      <span className="bg-white px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
        💪 Targeted Wellness Formulas
      </span>

      <span className="bg-white px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
        🚫 No Preservatives
      </span>

      <span className="bg-white px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
        ❤️ For Every Age Group
      </span>

      <span className="bg-white px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
        🇮🇳 Made in Tamil Nadu
      </span>
    </div>
  </div>
</div>
      {/* Categories Strip */}
      <div className="relative z-10 bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] py-3 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-white text-xs md:text-base font-medium">
          
          <span>🌾 Native Rice Varieties</span>

          <span className="hidden md:block opacity-40">
            |
          </span>

          <span>🌿 Millets</span>

          <span className="hidden md:block opacity-40">
            |
          </span>

          <span>🫘 Pulses & Dals</span>

          <span className="hidden md:block opacity-40">
            |
          </span>

          <span>🍶 Cooking Essentials</span>

          <span className="hidden md:block opacity-40">
            |
          </span>

          <span>🧈 Oils & Ghee</span>

          <span className="hidden md:block opacity-40">
            |
          </span>

          <span>🥣 Health Mixes</span>

        </div>
      </div>
    </section>
  );
}