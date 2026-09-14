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

  // ==========================
  // CLOSE PRODUCTS MENU
  // WHEN CLICKING OUTSIDE
  // ==========================
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

  // ==========================
  // CATEGORY SELECT
  // ==========================
  const handleCategorySelect = (category) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }

    if (setSelectedSubcategory) {
      setSelectedSubcategory("All");
    }

    setShowProductsMenu(false);
    setMenuOpen(false);

    // Go to products section
    setTimeout(() => {
      const productsSection =
        document.getElementById("products");

      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        window.location.hash = "products";
      }
    }, 50);
  };

  // ==========================
  // DISPLAY CATEGORIES
  // ==========================
  const visibleCategories = categories.filter(
    (cat) =>
      cat &&
      cat !== "All"
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-lg">

      <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">

        {/* ==========================
            LOGO
        ========================== */}
        <div className="flex items-center gap-3">

          <img
            src={MurungaLeaf}
            alt="Natvian Foods"
            className="h-20 w-auto"
          />

          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#31572C] tracking-tight">
              Natvian Foods
            </h1>

            <p className="text-sm font-medium text-gray-500">
              Healthy Traditional Foods
            </p>

            <div className="hidden xl:flex items-center gap-3 mt-2 text-[13px] text-[#4F772D] font-medium opacity-80">
              <span>🌿 100% Natural</span>
              <span className="text-[#C2A878]">•</span>

              <span>
                🌾 Organic & Traditional
              </span>

              <span className="text-[#C2A878]">•</span>

              <span>
                💚 No Preservatives
              </span>
            </div>
          </div>
        </div>

        {/* ==========================
            MOBILE MENU BUTTON
        ========================== */}
        <button
          className="lg:hidden text-3xl text-[#31572C]"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          ☰
        </button>

        {/* ==========================
            DESKTOP MENU
        ========================== */}
        <div className="hidden lg:flex items-center gap-6 ml-8">

          {/* HOME */}
          <a
            href="#home"
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            Home
          </a>

          {/* ==========================
              PRODUCTS DROPDOWN
          ========================== */}
          <div
            className="relative"
            ref={menuRef}
          >
            <button
              onClick={() =>
                setShowProductsMenu(
                  !showProductsMenu
                )
              }
              className={`font-medium transition ${
                showProductsMenu
                  ? "text-[#31572C]"
                  : "text-gray-700 hover:text-[#31572C]"
              }`}
            >
              Products
              <span className="ml-1 text-xs">
                ▾
              </span>
            </button>

            {showProductsMenu && (
              <div className="absolute left-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden z-[9999]">

                <div className="p-2">

                  {visibleCategories.map(
                    (cat) => {

                      const isSpecialCollections =
                        cat ===
                        "Special Collections";

                      return (
                        <button
                          key={cat}
                          onClick={() =>
                            handleCategorySelect(
                              cat
                            )
                          }
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${
                            isSpecialCollections
                              ? "bg-purple-50 text-purple-800 hover:bg-purple-100 font-semibold"
                              : "hover:bg-green-50 text-gray-700"
                          }`}
                        >

                          <span className="text-lg">
                            {isSpecialCollections
                              ? "🎁"
                              : "🌿"}
                          </span>

                          <span>
                            {cat}
                          </span>

                          {isSpecialCollections && (
                            <span className="ml-auto text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                              Combos
                            </span>
                          )}

                        </button>
                      );
                    }
                  )}

                </div>
              </div>
            )}
          </div>

          {/* ABOUT */}
          <a
            href="#about"
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            About
          </a>

          {/* CONTACT */}
          <a
            href="#contact"
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            Contact
          </a>

          {/* ==========================
              CART
          ========================== */}
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

          {/* DARK MODE */}
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="font-medium text-gray-700 hover:text-green-700 transition"
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
            className="font-medium text-gray-700 hover:text-green-700 transition"
          >
            {language === "en"
              ? "தமிழ்"
              : "English"}
          </button>

        </div>
      </div>

      {/* ==========================
          MOBILE MENU
      ========================== */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-sm border-t z-50">

          {/* HOME */}
          <a
            href="#home"
            onClick={() =>
              setMenuOpen(false)
            }
            className="block px-6 py-4 border-b"
          >
            Home
          </a>

          {/* PRODUCTS */}
          <div className="border-b">

            <div className="px-6 py-4 font-semibold text-[#31572C]">
              Products
            </div>

            {visibleCategories.map(
              (cat) => {

                const isSpecialCollections =
                  cat ===
                  "Special Collections";

                return (
                  <button
                    key={cat}
                    onClick={() =>
                      handleCategorySelect(
                        cat
                      )
                    }
                    className={`block w-full text-left px-10 py-3 transition ${
                      isSpecialCollections
                        ? "bg-purple-50 text-purple-800 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {isSpecialCollections
                      ? "🎁 "
                      : "🌿 "}

                    {cat}

                    {isSpecialCollections && (
                      <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                        Combos
                      </span>
                    )}
                  </button>
                );
              }
            )}

          </div>

          {/* ABOUT */}
          <a
            href="#about"
            onClick={() =>
              setMenuOpen(false)
            }
            className="block px-6 py-4 border-b"
          >
            About
          </a>

          {/* CONTACT */}
          <a
            href="#contact"
            onClick={() =>
              setMenuOpen(false)
            }
            className="block px-6 py-4 border-b"
          >
            Contact
          </a>

          {/* CART */}
          <a
            href="#cart"
            onClick={() =>
              setMenuOpen(false)
            }
            className="block px-6 py-4 border-b"
          >
            🛒 Cart ({cartCount})
          </a>

          {/* DARK MODE */}
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setMenuOpen(false);
            }}
            className="block w-full text-left px-6 py-4 border-b"
          >
            {darkMode
              ? "☀ Light"
              : "🌙 Dark"}
          </button>

          {/* LANGUAGE */}
          <button
            onClick={() => {
              setLanguage(
                language === "en"
                  ? "ta"
                  : "en"
              );

              setMenuOpen(false);
            }}
            className="block w-full text-left px-6 py-4"
          >
            {language === "en"
              ? "தமிழ்"
              : "English"}
          </button>

        </div>
      )}
    </nav>
  );
}