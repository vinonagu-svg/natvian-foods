export default function Navbar({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  cartCount,
}) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO + BRAND */}
        <div className="flex items-center gap-5">

          {/* LOGO */}
          <img
            src="/Logo.png"
            alt="Natvian Foods"
            className="h-20 md:h-24 w-auto object-contain"
          />

          {/* BRAND TEXT */}
          <div className="flex flex-col items-center">

            <h1 className="text-3xl md:text-5xl font-extrabold text-[#31572C] leading-tight tracking-tight text-center">
              Natvian Foods
            </h1>

            {/* UNDERLINE */}
            <div className="h-[2px] bg-[#4F772D] rounded-full mt-2 mb-2 w-full opacity-80"></div>

            {/* SUBTEXT */}
            <p className="text-xs md:text-lg text-[#4F772D] tracking-wide font-medium text-center">
              Powered By Thenativefood.com
            </p>

          </div>
        </div>

        {/* NAVIGATION */}
        <div className="hidden md:flex items-center gap-8 ml-auto">

          <a
            href="#home"
            className="text-gray-700 hover:text-[#4F772D] font-medium transition duration-300"
          >
            Home
          </a>

          <a
            href="#products"
            className="text-gray-700 hover:text-[#4F772D] font-medium transition duration-300"
          >
            Products
          </a>

          <a
            href="#about"
            className="text-gray-700 hover:text-[#4F772D] font-medium transition duration-300"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-gray-700 hover:text-[#4F772D] font-medium transition duration-300"
          >
            Contact
          </a>

          {/* CART */}
          <div className="bg-[#31572C] text-white px-5 py-2.5 rounded-2xl font-medium shadow-sm">
            🛒 Cart ({cartCount})
          </div>

          {/* DARK MODE BUTTON */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-[#EEF4E7] text-[#31572C] px-5 py-2.5 rounded-2xl font-medium hover:bg-[#DCE8CF] transition duration-300 shadow-sm"
          >
            {darkMode ? '☀ Light' : '🌙 Dark'}
          </button>

          {/* LANGUAGE BUTTON */}
          <button
            onClick={() =>
              setLanguage(language === 'en' ? 'ta' : 'en')
            }
            className="bg-[#31572C] text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-[#4F772D] transition duration-300 shadow-sm"
          >
            {language === 'en' ? 'தமிழ்' : 'English'}
          </button>

        </div>
      </div>
    </nav>
  )
}