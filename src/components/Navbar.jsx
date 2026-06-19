import { useState, useRef, useEffect } from "react";
import MurungaLeaf from "../assets/murunga-leaf.webp";
export default function Navbar({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  cartCount,
  categories = [],
  setSelectedCategory,
  setSelectedSubcategory,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const menuRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setShowProductsMenu(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  const handleCategorySelect = (category) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
      setSelectedSubcategory("All");
    }

    setShowProductsMenu(false);
    window.location.hash = "products";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={MurungaLeaf}
            alt="Natvian Foods"
            className="h-20 w-auto"
          />

          <div>
<div>
  <h1 className="text-3xl md:text-4xl font-black text-[#31572C] tracking-tight">
    Natvian Foods
  </h1>

  <p className="text-sm font-medium text-gray-500">
    Healthy Traditional Foods
  </p>
</div>

            <div className="hidden xl:flex items-center gap-3 mt-2 text-[13px] text-[#4F772D] font-medium opacity-80">
              <span>🌿 100% Natural</span>
              <span className="text-[#C2A878]">•</span>
              <span>🌾 Organic & Traditional </span>
              <span className="text-[#C2A878]">•</span>
              <span>💚 No Preservatives</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-3xl text-[#31572C]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 ml-8">

          <a
            href="#home"
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            Home
          </a>

          {/* Products Dropdown */}
          <div
  className="relative"
  ref={menuRef}
>
         <button
  onClick={() =>
    setShowProductsMenu(!showProductsMenu)
  }
  className={`font-medium transition ${
    showProductsMenu
      ? "text-[#31572C]"
      : "text-gray-700 hover:text-[#31572C]"
  }`}
>
  Products
</button>

            {showProductsMenu && (
              <div className="absolute left-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden z-[9999]">
                <div className="p-2">
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          handleCategorySelect(cat)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition"
                      >
                        <span>🌿</span>
                        <span>{cat}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <a
            href="#about"
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            About
          </a>

          <a
            href="#contact"
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            Contact
          </a>

          {/* Cart */}
          <a
            href="#cart"
            className="relative bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition shadow-md"
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </a>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>

          {/* Language */}
          <button
            onClick={() =>
              setLanguage(language === "en" ? "ta" : "en")
            }
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            {language === "en" ? "தமிழ்" : "English"}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-sm border-t z-50">

          <a
            href="#home"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b"
          >
            Home
          </a>

          <div className="border-b">
            <div className="px-6 py-4 font-semibold">
              Products
            </div>

            {categories
              .filter((cat) => cat !== "All")
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    handleCategorySelect(cat);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-10 py-3 hover:bg-gray-100"
                >
                  {cat}
                </button>
              ))}
          </div>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b"
          >
            About
          </a>

          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b"
          >
            Contact
          </a>

          <a
            href="#cart"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b"
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