export default function LeftHero({ language }) {
  return (
    <div className="relative z-10">

      {/* Tagline */}
      <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4 font-semibold">
  🎉 Launch Offer – 10% OFF on Health Mixes
</div>
      <p className="text-[#4F772D] text-xl md:text-2xl italic mb-4">
  🌾 Made with Traditional Ingredients & Superfoods
</p>

      {/* Main Heading */}
      <h1
  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
  style={{ fontFamily: "Playfair Display, serif" }}
>
        {language === "en" ? (
          <>
            <span className="text-[#1d140b]">
  Traditional Nutrition.
</span>

<br />

<span className="text-[#4F772D]">
  Modern Wellness.
</span>
          </>
        ) : (
          <>
            <span className="text-[#1d140b]">
              பாரம்பரிய உணவுகள்.
            </span>
            <br />
            <span className="text-[#4F772D]">
              ஆரோக்கியமான வாழ்க்கை.
            </span>
          </>
        )}
      </h1>

      {/* Description */}
      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl">
  One Family. Seven Wellness Solutions. Discover Natvian Foods' complete range of health mixes crafted with millets, native herbs, and natural superfoods to support growth, vitality, diabetic wellness, family nutrition, and healthy ageing.
</p>
<div className="flex flex-wrap gap-3 mb-8 text-sm font-medium">

  <span className="text-[#4F772D]">✓ Women Wellness</span>
  <span className="text-[#4F772D]">✓ Men's Nutrition</span>
  <span className="text-[#4F772D]">✓ Kids Growth</span>
  <span className="text-[#4F772D]">✓ Couple Wellness</span>
  <span className="text-[#4F772D]">✓ Diabetic Care</span>
  <span className="text-[#4F772D]">✓ Senior Health</span>

</div>
      {/* Buttons */}
      <div className="flex flex-wrap gap-5">
        <a
          href="#products"
          className="bg-[#4F772D] hover:bg-[#31572C] hover:scale-105 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
        >
          🛒 Shop Collection
        </a>

        <a
          href="#products"
          className="border-2 border-[#4F772D] text-[#4F772D] hover:bg-[#4F772D] hover:text-white hover:scale-105 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
        >
          🌿 Explore Wellness Range
        </a>
      </div>
    </div>
  );
}