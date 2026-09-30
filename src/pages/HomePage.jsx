import { useState, useEffect, Suspense, lazy } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

// Components
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WellnessSection from "../components/WellnessSection";
import Features from "../components/Features";
import ProductGrid from "../components/ProductGrid";
import About from "../components/About";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

// Images
import MurungabannerImage from "../assets/Murunga-banner.webp";
import BananabannerImage from "../assets/Bloom-banner.webp";

// Lazy Components
const Cart = lazy(() => import("../components/Cart"));

const Testimonials = lazy(() =>
  import("../components/Testimonials")
);

export default function HomePage() {
  // =========================================================
  // BASIC STATE
  // =========================================================

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const [cart, setCart] = useState([]);

  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);

  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  // Keep this because Navbar may still use subcategory navigation.
  // Homepage itself does not display subcategory filter buttons.
  const [selectedSubcategory, setSelectedSubcategory] =
    useState("All");

  // =========================================================
  // HELPER
  // =========================================================

  const cleanValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value).trim();
  };

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("isActive", "==", true)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(data);

        console.log("Fetched Products:", data);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );
      }
    };

    fetchProducts();
  }, []);

  // =========================================================
  // FETCH COMBO PACKS
  // =========================================================
  //
  // Combo Packs are stored in "combopacks" collection.
  //
  // =========================================================

  useEffect(() => {
    const fetchComboPacks = async () => {
      try {
        const q = query(
          collection(db, "combopacks"),
          where("isActive", "==", true)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCombos(data);

        console.log(
          "Fetched Combo Packs:",
          data
        );
      } catch (error) {
        console.error(
          "Error fetching combo packs:",
          error
        );

        setCombos([]);
      }
    };

    fetchComboPacks();
  }, []);

  // =========================================================
  // FETCH COUPONS
  // =========================================================

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "coupons")
        );

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCoupons(data);
      } catch (error) {
        console.error(
          "Error fetching coupons:",
          error
        );
      }
    };

    fetchCoupons();
  }, []);

  // =========================================================
  // LAUNCH OFFER
  // =========================================================

  const OFFER_CONFIG = {
    name: "Launching Offer",
    type: "PERCENT",
    value: 10,
    isActive: true,
  };

  const getOfferPrice = (price) => {
    const safePrice = Number(price) || 0;

    if (!OFFER_CONFIG.isActive) {
      return safePrice;
    }

    return (
      safePrice -
      (safePrice * OFFER_CONFIG.value) / 100
    );
  };

  // =========================================================
  // ADD NORMAL PRODUCT TO CART
  // =========================================================

  const addToCart = (product, variant) => {
    if (!product || !variant) {
      console.error(
        "Missing product or variant",
        product,
        variant
      );

      return;
    }

    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.weight === variant.weight &&
        item.type !== "combo"
    );

    if (existingIndex !== -1) {
      const updated = [...cart];

      updated[existingIndex].qty += 1;

      setCart(updated);

      return;
    }

    setCart((prev) => [
      ...prev,
      {
        id: product.id,

        type: "product",

        name: product.name,

        tamilName:
          product.tamilName || "",

        image:
          product.images?.[0] || "",

        weight:
          variant?.weight || "",

        // Original product price
        mrp:
          Number(variant?.price) || 0,

        qty: 1,
      },
    ]);
  };

  // =========================================================
  // ADD COMBO PACK TO CART
  // =========================================================
  //
  // IMPORTANT:
  // Combo Pack has its own selling price.
  //
  // regularPrice = combined original product price
  // comboPrice   = actual discounted combo price
  // savings      = amount saved
  //
  // The Cart will use comboPrice for billing.
  //
  // =========================================================

  const addComboToCart = (combo) => {
    if (!combo) {
      console.error(
        "Missing combo",
        combo
      );

      return;
    }

    const regularPrice =
      Number(combo.regularPrice) || 0;

    const comboPrice =
      Number(combo.comboPrice) || 0;

    const savings =
      Number(combo.savings) ||
      Math.max(
        regularPrice - comboPrice,
        0
      );

    // Check if this exact combo is already in cart
    const existingIndex = cart.findIndex(
      (item) =>
        item.type === "combo" &&
        item.id === combo.id
    );

    if (existingIndex !== -1) {
      const updated = [...cart];

      updated[existingIndex].qty += 1;

      setCart(updated);

      return;
    }

    // Add combo to cart
    setCart((prev) => [
      ...prev,
      {
        id: combo.id,

        // Important for Cart pricing
        type: "combo",

        name: combo.name || "",

        tamilName:
          combo.tamilName || "",

        image:
          combo.image ||
          combo.items?.[0]?.image ||
          "",

        weight: "Combo Pack",

        // Original combined price
        regularPrice: regularPrice,

        // Actual discounted selling price
        comboPrice: comboPrice,

        // Customer savings
        savings: savings,

        // Keep mrp for compatibility
        // with existing Cart code
        mrp: regularPrice,

        qty: 1,

        // Products inside the combo
        items: combo.items || [],
      },
    ]);

    console.log(
      "Combo added to cart:",
      {
        id: combo.id,
        name: combo.name,
        regularPrice,
        comboPrice,
        savings,
      }
    );
  };

  // =========================================================
  // REMOVE FROM CART
  // =========================================================

  const removeFromCart = (index) => {
    const updated = [...cart];

    updated.splice(index, 1);

    setCart(updated);
  };

  // =========================================================
  // TOTAL PRICE
  // =========================================================
  //
  // Normal product:
  // Original price -> 10% Launching Offer
  //
  // Combo:
  // Uses comboPrice directly.
  //
  // Combo does NOT receive another 10% launch discount.
  //
  // =========================================================

  const totalPrice = cart.reduce(
    (total, item) => {
      const price =
        item.type === "combo"
          ? Number(item.comboPrice) || 0
          : getOfferPrice(item.mrp);

      return (
        total +
        price *
          (Number(item.qty) || 0)
      );
    },
    0
  );

  // =========================================================
  // APPLY COUPON
  // =========================================================

  const applyCoupon = (code) => {
    if (!code) {
      return;
    }

    const coupon = coupons.find(
      (c) =>
        cleanValue(c.code).toLowerCase() ===
        cleanValue(code).toLowerCase()
    );

    if (!coupon) {
      alert("Invalid coupon");
      return;
    }

    setAppliedCoupon(coupon);
  };

  // =========================================================
  // COUPON DISCOUNT
  // =========================================================

  const discount = appliedCoupon
    ? cleanValue(
        appliedCoupon.type
      ).toUpperCase() === "PERCENT"
      ? (totalPrice *
          (Number(
            appliedCoupon.value
          ) || 0)) /
        100
      : Number(
          appliedCoupon.value
        ) || 0
    : 0;

  // =========================================================
  // FINAL PRICE
  // =========================================================

  const finalPrice = Math.max(
    totalPrice - discount,
    0
  );

  // =========================================================
  // CATEGORY LIST
  // =========================================================
  //
  // Categories come from BOTH:
  // 1. Products
  // 2. Combo Packs
  //
  // This ensures Special Collections appears.
  //
  // =========================================================

  const productCategories = products
    .map((product) =>
      cleanValue(product.category)
    )
    .filter(Boolean);

  const comboCategories = combos
    .map((combo) =>
      cleanValue(combo.category) ||
      "Special Collections"
    )
    .filter(Boolean);

  const categories = [
    "All",
    ...new Set([
      ...productCategories,
      ...comboCategories,
    ]),
  ];

  // =========================================================
  // PRODUCT FILTER
  // =========================================================

  const filteredProducts =
    products.filter((product) => {
      const category =
        cleanValue(product.category);

      const productCategoryMatch =
        selectedCategory === "All" ||
        category === selectedCategory;

      const productSubcategory =
        cleanValue(product.subcategory);

      const subcategoryMatch =
        selectedSubcategory === "All" ||
        !selectedSubcategory ||
        productSubcategory ===
          selectedSubcategory;

      return (
        productCategoryMatch &&
        subcategoryMatch
      );
    });

  // =========================================================
  // COMBO FILTER
  // =========================================================

  const filteredCombos =
    combos.filter((combo) => {
      const category =
        cleanValue(combo.category) ||
        "Special Collections";

      return (
        selectedCategory === "All" ||
        category === selectedCategory
      );
    });

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All");

    setTimeout(() => {
      const productsSection =
        document.getElementById(
          "products"
        );

      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className={
        darkMode
          ? "bg-[#101510] text-white min-h-screen"
          : "bg-[#F8F7F2] text-gray-800 min-h-screen"
      }
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}

        language={language}
        setLanguage={setLanguage}

        cartCount={cart.length}

        categories={categories}

        setSelectedCategory={
          handleCategoryChange
        }

        setSelectedSubcategory={
          setSelectedSubcategory
        }
      />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section id="home">
        <Hero language={language} />
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <Features />

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        id="products"
        className="max-w-7xl mx-auto px-6 py-12 scroll-mt-24"
      >
        {/* PRODUCT HEADER */}

        <div className="mb-7">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {language === "ta"
                  ? "எங்கள் தயாரிப்புகள்"
                  : "Our Products"}
              </h2>

              <p className="text-gray-500 mt-2">
                {language === "ta"
                  ? "பாரம்பரிய உணவுகள் • இயற்கையான தேர்வு"
                  : "Traditional foods made with care"}
              </p>
            </div>
          </div>

          {/* =================================================
              SIMPLE CATEGORY BAR
              ================================================= */}

          <div className="mt-6 -mx-2 px-2 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max pb-2">
              {categories.map((category) => {
                const isSelected =
                  selectedCategory ===
                  category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      handleCategoryChange(
                        category
                      )
                    }
                    className={`
                      whitespace-nowrap
                      px-4 py-2
                      rounded-full
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      border
                      ${
                        isSelected
                          ? "bg-green-700 text-white border-green-700 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-green-500 hover:text-green-700"
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =================================================
            NORMAL PRODUCTS
            ================================================= */}

        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={
              filteredProducts
            }
            addToCart={addToCart}
          />
        ) : selectedCategory ===
          "Special Collections" ? (
          <div className="py-4" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 py-14 px-6 text-center">
            <p className="text-gray-500 text-lg">
              {language === "ta"
                ? "இந்த வகையில் தற்போது தயாரிப்புகள் இல்லை."
                : "No products available in this category."}
            </p>
          </div>
        )}
      </section>

      {/* =====================================================
          COMBO PACKS
      ===================================================== */}

      {filteredCombos.length > 0 && (
        <section
          id="combo-packs"
          className="max-w-7xl mx-auto px-6 py-12 scroll-mt-24"
        >
          {/* COMBO HEADER */}

          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {language === "ta"
                ? "காம்போ தொகுப்புகள்"
                : "Combo Packs"}
            </h2>

            <p className="text-gray-500 mt-2">
              {language === "ta"
                ? "சிறப்பாகத் தேர்ந்தெடுக்கப்பட்ட உணவுத் தொகுப்புகளில் அதிகம் சேமிக்கவும்."
                : "Save more with our specially curated traditional food combos."}
            </p>
          </div>

          {/* COMBO GRID */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCombos.map(
              (combo) => {
                const regularPrice =
                  Number(
                    combo.regularPrice
                  ) || 0;

                const comboPrice =
                  Number(
                    combo.comboPrice
                  ) || 0;

                const savings =
                  Number(
                    combo.savings
                  ) ||
                  Math.max(
                    regularPrice -
                      comboPrice,
                    0
                  );

                const comboImage =
                  combo.image ||
                  combo.items?.[0]
                    ?.image ||
                  "/placeholder.png";

                return (
                  <div
                    key={combo.id}
                    className="
                      bg-white
                      rounded-2xl
                      overflow-hidden
                      border
                      border-gray-100
                      shadow-sm
                      hover:shadow-xl
                      transition-all
                      duration-300
                    "
                  >
                    {/* IMAGE */}

                    <div className="relative bg-gray-50">
                      <img
                        src={comboImage}
                        alt={
                          combo.name ||
                          "Combo Pack"
                        }
                        className="
                          w-full
                          h-64
                          object-cover
                        "
                        onError={(event) => {
                          event.currentTarget.src =
                            "/placeholder.png";
                        }}
                      />

                      {/* SAVINGS BADGE */}

                      {savings > 0 && (
                        <div
                          className="
                            absolute
                            top-4
                            right-4
                            bg-green-700
                            text-white
                            px-3
                            py-1.5
                            rounded-full
                            text-sm
                            font-semibold
                            shadow-sm
                          "
                        >
                          {language === "ta"
                            ? `₹${savings} சேமிப்பு`
                            : `Save ₹${savings}`}
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="p-5">
                      {/* NAME */}

                      <h3 className="text-xl font-bold text-gray-900">
                        {language === "ta" &&
                        combo.tamilName
                          ? combo.tamilName
                          : combo.name}
                      </h3>

                      {/* ENGLISH NAME */}

                      {language === "ta" &&
                        combo.tamilName && (
                          <p className="text-sm text-gray-500 mt-1">
                            {combo.name}
                          </p>
                        )}

                      {/* DESCRIPTION */}

                      {combo.description && (
                        <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                          {
                            combo.description
                          }
                        </p>
                      )}

                      {/* INCLUDED ITEMS */}

                      {combo.items?.length >
                        0 && (
                        <div className="mt-4">
                          <p className="font-semibold text-sm mb-2 text-gray-800">
                            {language ===
                            "ta"
                              ? "இந்த தொகுப்பில்:"
                              : "This Combo Includes:"}
                          </p>

                          <ul className="text-sm text-gray-600 space-y-1.5">
                            {combo.items.map(
                              (
                                item,
                                index
                              ) => (
                                <li
                                  key={
                                    index
                                  }
                                  className="leading-relaxed"
                                >
                                  •{" "}
                                  {
                                    item.productName
                                  }

                                  {item.weight
                                    ? ` - ${item.weight}`
                                    : ""}

                                  {item.quantity >
                                  1
                                    ? ` x ${item.quantity}`
                                    : ""}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {/* PRICE */}

                      <div className="flex items-end gap-3 mt-5">
                        {regularPrice >
                          comboPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ₹
                            {
                              regularPrice
                            }
                          </span>
                        )}

                        <span className="text-2xl font-bold text-green-700">
                          ₹
                          {
                            comboPrice
                          }
                        </span>
                      </div>

                      {/* SAVINGS */}

                      {savings > 0 && (
                        <p className="text-green-600 text-sm mt-1 font-medium">
                          {language ===
                          "ta"
                            ? `நீங்கள் ₹${savings} சேமிக்கிறீர்கள்`
                            : `You save ₹${savings}`}
                        </p>
                      )}

                      {/* ADD TO CART */}

                      <button
                        type="button"
                        onClick={() =>
                          addComboToCart(
                            combo
                          )
                        }
                        className="
                          w-full
                          mt-5
                          bg-green-700
                          hover:bg-green-800
                          text-white
                          py-3
                          rounded-xl
                          font-semibold
                          transition
                          duration-200
                        "
                      >
                        {language ===
                        "ta"
                          ? "காம்போவை கார்ட்டில் சேர்க்கவும்"
                          : "Add Combo to Cart"}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          CART
      ===================================================== */}

      <section
        id="cart"
        className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24"
      >
        <Suspense
          fallback={
            <div className="text-center py-10 text-gray-500">
              Loading Cart...
            </div>
          }
        >
          <Cart
            cart={cart}
            setCart={setCart}
            removeFromCart={
              removeFromCart
            }
            totalPrice={
              totalPrice
            }
            finalPrice={
              finalPrice
            }
            discount={
              discount
            }
            applyCoupon={
              applyCoupon
            }
            appliedCoupon={
              appliedCoupon
            }
          />
        </Suspense>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section id="about">
        <About />
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <FAQ />

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <Suspense
        fallback={
          <div className="text-center py-10 text-gray-500">
            Loading Testimonials...
          </div>
        }
      >
        <Testimonials />
      </Suspense>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section id="contact">
        <Contact />
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </div>
  );
}