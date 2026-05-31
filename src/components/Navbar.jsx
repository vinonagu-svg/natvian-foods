import { useState } from "react";

export default function Navbar({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  cartCount,
}) { const [menuOpen, setMenuOpen] = useState(false);

  return (

    <nav className="sticky top-0 z-50 relative bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

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
            <p className="text-sm md:text-[15px] text-[#4F772D] font-medium mt-1">

             Healthy Traditional Foods

            </p>

              {/* TRUST BADGES */}
                <div className="flex items-center gap-3 mt-2 text-[13px] text-[#4F772D] font-medium opacity-80 flex-wrap">

                  <span>🌿 100% Natural</span>

                 <span className="text-[#C2A878]">•</span>

                <span>🌾 Millet Based</span>

               <span className="text-[#C2A878]">•</span>

              <span>💚 No Preservatives</span>

            </div>

          </div>

        </div>
        <button
          className="lg:hidden text-3xl text-[#31572C]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
         ☰
        </button>
        {/* DESKTOP NAVIGATION */}
<div className="hidden lg:flex items-center gap-6 ml-16">

  <a href="#home" className="text-gray-700 hover:text-[#4F772D]">
    Home
  </a>

  <a href="#products" className="text-gray-700 hover:text-[#4F772D]">
    Products
  </a>

  <a href="#about" className="text-gray-700 hover:text-[#4F772D]">
    About
  </a>

  <a href="#contact" className="text-gray-700 hover:text-[#4F772D]">
    Contact
  </a>

  <a href="#cart" className="text-gray-700 hover:text-[#4F772D]">
    🛒 Cart ({cartCount})
  </a>

  <button
    onClick={() => setDarkMode(!darkMode)}
    className="text-gray-700 hover:text-[#4F772D]"
  >
    {darkMode ? "☀ Light" : "🌙 Dark"}
  </button>

  <button
    onClick={() =>
      setLanguage(language === "en" ? "ta" : "en")
    }
    className="text-gray-700 hover:text-[#4F772D]"
  >
    {language === "en" ? "தமிழ்" : "English"}
  </button>

</div>

</div> {/* closes max-w-7xl container */}

{/* MOBILE MENU */}
{menuOpen && (
  <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t z-50">

    <a
      href="#home"
      className="block px-6 py-4 border-b"
      onClick={() => setMenuOpen(false)}
    >
      Home
    </a>

    <a
      href="#products"
      className="block px-6 py-4 border-b"
      onClick={() => setMenuOpen(false)}
    >
      Products
    </a>

    <a
      href="#about"
      className="block px-6 py-4 border-b"
      onClick={() => setMenuOpen(false)}
    >
      About
    </a>

    <a
      href="#contact"
      className="block px-6 py-4 border-b"
      onClick={() => setMenuOpen(false)}
    >
      Contact
    </a>

    <a
      href="#cart"
      className="block px-6 py-4 border-b"
      onClick={() => setMenuOpen(false)}
    >
      🛒 Cart ({cartCount})
    </a>

    <button
      onClick={() => {
        setDarkMode(!darkMode);
        setMenuOpen(false);
      }}
      className="block w-full text-left px-6 py-4 border-b"
    >
      {darkMode ? "☀ Light" : "🌙 Dark"}
    </button>

    <button
      onClick={() => {
        setLanguage(language === "en" ? "ta" : "en");
        setMenuOpen(false);
      }}
      className="block w-full text-left px-6 py-4"
    >
      {language === "en" ? "தமிழ்" : "English"}
    </button>
  </div>
)}
    </nav>
  );
}