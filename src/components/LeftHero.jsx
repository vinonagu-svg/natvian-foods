export default function LeftHero({ language }) {
  return (
    <div className="relative z-10">

      {/* Tagline */}
      <p className="text-[#4F772D] text-lg md:text-xl italic mb-2">
        🌾 {language === "en"
          ? "Traditional Ingredients. Modern Nutrition."
          : "பாரம்பரிய பொருட்கள். நவீன ஊட்டச்சத்து."}
      </p>

      {/* Main Heading */}
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] mb-4"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        {language === "en" ? (
          <>
            <span className="text-[#1d140b]">
              Pure Traditions.
            </span>
            <br />
            <span className="text-[#4F772D]">
              Better Living.
            </span>
          </>
        ) : (
          <>
            <span className="text-[#1d140b]">
              தூய பாரம்பரியம்.
            </span>
            <br />
            <span className="text-[#4F772D]">
              சிறந்த வாழ்க்கை.
            </span>
          </>
        )}
      </h1>

      {/* Description */}
      <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-snug mb-5 max-w-xl">
        {language === "en"
          ? "Explore Natvian Foods’ growing range of thoughtfully crafted health mixes, bringing together millets, native ingredients, herbs, grains, and natural superfoods for women, men, couples, and active families."
          : "சிறுதானியங்கள், பாரம்பரிய உணவுப் பொருட்கள், மூலிகைகள், தானியங்கள் மற்றும் இயற்கை சூப்பர்ஃபுட்களை இணைத்து, பெண்கள், ஆண்கள், தம்பதிகள் மற்றும் குடும்பங்களின் அன்றாட ஊட்டச்சத்திற்காக கவனமாக தயாரிக்கப்பட்ட Natvian Foods ஆரோக்கிய கலவைகளை கண்டறியுங்கள்."}
      </p>

      {/* Product Wellness Categories */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 text-sm md:text-[15px] font-medium">

        <span className="text-[#4F772D]">
          ✓ Banana Bloom — Women’s Wellness
        </span>

        <span className="text-[#4F772D]">
          ✓ Murunga Leaf — Family Nutrition
        </span>

        <span className="text-[#4F772D]">
          ✓ Murunga Bloom — Men & Women
        </span>

        <span className="text-[#4F772D]">
          ✓ Avarampoo — Sugar Balance
        </span>

        <span className="text-[#4F772D]">
          ✓ Black Rice & Horse Gram — Fitness & Vitality
        </span>

      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4">

        <a
          href="#products"
          className="bg-[#4F772D] hover:bg-[#31572C] hover:scale-105 text-white px-7 py-3 rounded-xl text-base md:text-lg font-semibold transition-all duration-300"
        >
          🛒 {language === "en"
            ? "Shop Collection"
            : "தயாரிப்புகளை காண்க"}
        </a>

        <a
          href="#products"
          className="border-2 border-[#4F772D] text-[#4F772D] hover:bg-[#4F772D] hover:text-white hover:scale-105 px-7 py-3 rounded-xl text-base md:text-lg font-semibold transition-all duration-300"
        >
          🌿 {language === "en"
            ? "Explore Wellness Range"
            : "ஆரோக்கிய கலவைகளை காண்க"}
        </a>

      </div>

    </div>
  );
}