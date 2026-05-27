export default function Navbar({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  cartCount,
}) {

  return (

    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">

        {/* =========================
            LOGO + BRAND
        ========================= */}
        <div className="flex items-center gap-5">

          {/* LOGO */}
          <img
            src="/Logo.webp"
            alt="Natvian Foods"
            className="h-20 md:h-24 w-auto object-contain"
          />

          {/* BRAND */}
          <div className="flex flex-col items-start">

            <h1 className="text-3xl md:text-5xl font-extrabold text-[#31572C] leading-tight tracking-tight">

              Natvian Foods

            </h1>

            {/* LINE */}
            <div className="h-[2px] bg-[#4F772D] rounded-full mt-2 mb-3 w-full opacity-70"></div>

            {/* SUBTEXT */}
            <p className="text-sm md:text-xl text-[#4F772D] tracking-wide font-semibold leading-relaxed">

             Healthy Traditional Foods

            </p>

              {/* TRUST BADGES */}
                <div className="hidden md:flex items-center gap-3 mt-3 text-sm text-[#4F772D] font-medium opacity-90 flex-wrap">

                  <span>🌿 100% Natural</span>

                 <span>•</span>

                <span>🌾 Millet Based</span>

               <span>•</span>

              <span>💚 No Preservatives</span>

            </div>

          </div>

        </div>

        {/* =========================
            NAVIGATION
        ========================= */}
        <div className="hidden lg:flex items-center gap-8 ml-auto">

          {/* HOME */}
          <a
            href="#home"
            className="text-gray-700 hover:text-[#4F772D] font-semibold tracking-wide transition duration-300"
          >
            Home
          </a>

          {/* PRODUCTS */}
          <a
            href="#products"
            className="text-gray-700 hover:text-[#4F772D] font-semibold tracking-wide transition duration-300"
          >
            Products
          </a>

          {/* ABOUT */}
          <a
            href="#about"
            className="text-gray-700 hover:text-[#4F772D] font-semibold tracking-wide transition duration-300"
          >
            About
          </a>

          {/* CONTACT */}
          <a
            href="#contact"
            className="text-gray-700 hover:text-[#4F772D] font-semibold tracking-wide transition duration-300"
          >
            Contact
          </a>

          {/* CART */}
          <a
            href="#cart"
            className="bg-[#31572C] text-white px-5 py-2.5 rounded-2xl font-semibold shadow-md hover:bg-[#4F772D] hover:scale-105 transition duration-300"
          >
            🛒 Cart ({cartCount})
          </a>

          {/* DARK MODE */}
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="bg-[#EEF4E7] text-[#31572C] hover:bg-[#DCE8CF] px-5 py-2.5 rounded-2xl font-medium hover:scale-105 transition duration-300 shadow-sm"
          >

            {darkMode
              ? "☀ Light"
              : "🌙 Dark"}

          </button>

          {/* LANGUAGE */}
          <button
            onClick={() =>
              setLanguage(
                language === "en"
                  ? "ta"
                  : "en"
              )
            }
            className="bg-[#31572C] hover:bg-[#4F772D] text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-[#4F772D] transition duration-300 shadow-sm"
          >

            {language === "en"
              ? "தமிழ்"
              : "English"}

          </button>

        </div>

      </div>

    </nav>
  );
}