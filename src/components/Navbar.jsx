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
        <div className="flex items-center gap-3">

          {/* LOGO */}
          <img
            src="/Logo.webp"
            alt="Natvian Foods"
            className="h-16 md:h-20 w-auto object-contain"
          />

          {/* BRAND */}
          <div className="flex flex-col justify-center">

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#31572C] leading-tight tracking-tight">

              Natvian Foods

            </h1>

            {/* SUBTEXT */}
            <p className="text-sm md:text-base text-[#4F772D] font-medium mt-1">

             Healthy Traditional Foods

            </p>

              {/* TRUST BADGES */}
                <div className="flex items-center gap-2 mt-2 text-xs text-[#4F772D] font-medium opacity-80 flex-wrap">

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
            className="relative text-gray-700 hover:text-[#4F772D] font-medium tracking-wide text-[15px] transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#4F772D] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
          >
            Home
          </a>

          {/* PRODUCTS */}
          <a
            href="#products"
            className="relative text-gray-700 hover:text-[#4F772D] font-medium tracking-wide text-[15px] transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#4F772D] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
          >
            Products
          </a>

          {/* ABOUT */}
          <a
            href="#about"
            className="relative text-gray-700 hover:text-[#4F772D] font-medium tracking-wide text-[15px] transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#4F772D] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
          >
            About
          </a>

          {/* CONTACT */}
          <a
            href="#contact"
            className="relative text-gray-700 hover:text-[#4F772D] font-medium tracking-wide text-[15px] transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#4F772D] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
          >
            Contact
          </a>

          {/* CART */}
          <a
            href="#cart"
            className="relative text-gray-700 hover:text-[#4F772D] font-medium tracking-wide text-[15px] transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#4F772D] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
          >
            🛒 Cart ({cartCount})
          </a>

          {/* DARK MODE */}
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="relative text-gray-700 hover:text-[#4F772D] font-medium tracking-wide text-[15px] transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#4F772D] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
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
            className="relative text-gray-700 hover:text-[#4F772D] font-medium tracking-wide text-[15px] transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#4F772D] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
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