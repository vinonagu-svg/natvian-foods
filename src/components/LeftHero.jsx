export default function LeftHero({ language }) {
  return (
    <div className="relative z-10">
      <p className="uppercase tracking-[5px] text-[#4F772D] font-semibold mb-5">
        Natural • Healthy • Traditional
      </p>

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-8 text-[#31572C] max-w-[700px]">
        {language === 'en' ? (
          <>
            Premium Traditional Foods <br />
            For Healthy Living
          </>
        ) : (
          <>
            ஆரோக்கியமான வாழ்க்கைக்கான <br />
            பாரம்பரிய உணவுகள்
          </>
        )}
      </h2>

      <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 max-w-xl">
        Discover wholesome nutrition inspired by traditional recipes.
        Natvian Foods brings together health, taste, and natural
        ingredients for modern lifestyles.
      </p>

      {/* BENEFITS */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          '100% Natural',
          'Rich Nutrients',
          'No Preservatives',
          'Traditional Goodness',
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-[#eef4e7] flex items-center justify-center text-[#31572C] font-bold">
              ✓
            </div>

            <p className="font-semibold text-[#31572C] text-sm md:text-base">
              {item}
            </p>
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-5">
        <button className="bg-[#4F772D] hover:bg-[#31572C] text-white px-8 py-4 rounded-2xl shadow-xl text-lg font-semibold transition duration-300">
          Shop Healthy Today
        </button>

        <button className="border-2 border-[#4F772D] text-[#4F772D] hover:bg-[#4F772D] hover:text-white px-8 py-4 rounded-2xl text-lg font-semibold transition duration-300">
          Explore More
        </button>
      </div>
    </div>
  )
}