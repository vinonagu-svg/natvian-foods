import LeftHero from "./LeftHero";
import RightHero from "./RightHero";

import HeroProductsImage from "../assets/hero-products.webp";
import FarmBackground from "../assets/farm-background.webp";

export default function Hero({ language }) {
  return (
    <section className="relative overflow-hidden">
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
          px-5 sm:px-6
          py-4 md:py-5 lg:py-6
          grid
          lg:grid-cols-[1fr_1.05fr]
          gap-4 lg:gap-6
          items-start
        "
      >
        {/* Left Content */}
        <LeftHero language={language} />

        {/* Right Product Image */}
        <div
          className="
            relative
            mt-2
            lg:mt-8
          "
        >
          <RightHero
            HeroProductsImage={HeroProductsImage}
          />
        </div>
      </div>
    </section>
  );
}