// src/components/WellnessSection.jsx

export default function WellnessSection({ language }) {
  const wellnessItems = [
    {
      icon: "🌸",
      title: language === "en" ? "Women’s Wellness" : "பெண்கள் நலம்",
      product: "Banana Bloom",
      description:
        language === "en"
          ? "Traditional ingredients thoughtfully blended for everyday women’s nutrition."
          : "பெண்களின் அன்றாட ஊட்டச்சத்திற்காக பாரம்பரிய பொருட்களுடன் கவனமாக தயாரிக்கப்பட்ட கலவை.",
    },
    {
      icon: "🌿",
      title: language === "en" ? "Family Nutrition" : "குடும்ப ஊட்டச்சத்து",
      product: "Murunga Leaf",
      description:
        language === "en"
          ? "A wholesome everyday health mix made with moringa and native ingredients."
          : "முருங்கை இலை மற்றும் பாரம்பரிய பொருட்களுடன் தயாரிக்கப்பட்ட அன்றாட ஆரோக்கிய கலவை.",
    },
    {
      icon: "🤍",
      title: language === "en" ? "Couple Wellness" : "தம்பதியர் நலம்",
      product: "Murunga Bloom",
      description:
        language === "en"
          ? "A nourishing blend thoughtfully crafted for men and women."
          : "ஆண்கள் மற்றும் பெண்களுக்காக கவனமாக உருவாக்கப்பட்ட ஊட்டச்சத்து கலவை.",
    },
    {
      icon: "🌼",
      title: language === "en" ? "Balanced Living" : "சமநிலையான வாழ்க்கை",
      product: "Avarampoo",
      description:
        language === "en"
          ? "Inspired by traditional ingredients for a balanced everyday lifestyle."
          : "சமநிலையான அன்றாட வாழ்க்கைக்கான பாரம்பரிய பொருட்களால் உருவாக்கப்பட்டது.",
    },
    {
      icon: "🖤",
      title: language === "en" ? "Active Lifestyle" : "சுறுசுறுப்பான வாழ்க்கை",
      product: "Black Rice & Horse Gram",
      description:
        language === "en"
          ? "A hearty blend of native grains and pulses for active lifestyles."
          : "சுறுசுறுப்பான வாழ்க்கை முறைக்காக பாரம்பரிய தானியங்கள் மற்றும் பருப்புகளின் ஊட்டச்சத்து கலவை.",
    },
  ];

  return (
    <section
      className="bg-[#F8F7F2] py-10 md:py-12 border-t border-[#E8E4D8]"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6">

        {/* Section Heading */}
        <div className="text-center mb-7">
          <p className="text-[#4F772D] text-sm md:text-base font-medium italic mb-1">
            🌿 {language === "en"
              ? "Traditional Ingredients. Everyday Wellness."
              : "பாரம்பரிய பொருட்கள். அன்றாட நலம்."}
          </p>

          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1B4332]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {language === "en"
              ? "Made for Everyday Wellness"
              : "அன்றாட ஆரோக்கியத்திற்காக"}
          </h2>

          <p className="text-gray-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            {language === "en"
              ? "Thoughtfully crafted blends for different needs and lifestyles."
              : "வெவ்வேறு தேவைகள் மற்றும் வாழ்க்கை முறைகளுக்காக கவனமாக தயாரிக்கப்பட்ட ஆரோக்கிய கலவைகள்."}
          </p>
        </div>

        {/* Wellness Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {wellnessItems.map((item, index) => (
            <div
              key={index}
              className="
                group
                bg-white
                border border-[#E5E2D8]
                rounded-2xl
                px-4 py-5
                text-center
                shadow-sm
                hover:shadow-md
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              {/* Icon */}
              <div
                className="
                  w-14 h-14
                  mx-auto mb-3
                  rounded-full
                  bg-[#F1F5E9]
                  flex items-center justify-center
                  text-2xl
                  group-hover:scale-105
                  transition-transform
                  duration-300
                "
              >
                {item.icon}
              </div>

              {/* Wellness Title */}
              <h3 className="text-[#1B4332] font-semibold text-base md:text-[17px] leading-tight">
                {item.title}
              </h3>

              {/* Product Name */}
              <p className="text-[#4F772D] font-medium text-sm mt-1">
                {item.product}
              </p>

              {/* Description */}
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed mt-2">
                {item.description}
              </p>
            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="text-center mt-7">
          <a
            href="#products"
            className="
              inline-flex
              items-center
              gap-2
              bg-[#4F772D]
              hover:bg-[#31572C]
              text-white
              px-6 py-3
              rounded-xl
              text-sm md:text-base
              font-semibold
              shadow-sm
              hover:shadow-md
              hover:scale-105
              transition-all
              duration-300
            "
          >
            🌿
            {language === "en"
              ? "Explore All Health Mixes"
              : "அனைத்து ஆரோக்கிய கலவைகளையும் காண்க"}
            <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}