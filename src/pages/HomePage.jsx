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
  const [darkMode, setDarkMode] =
    useState(false);

  const [language, setLanguage] =
    useState("en");

  const [cart, setCart] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [coupons, setCoupons] =
    useState([]);

  const [appliedCoupon, setAppliedCoupon] =
    useState(null);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    selectedSubcategory,
    setSelectedSubcategory,
  ] = useState("All");

 // // ==========================
// FETCH PRODUCTS
// ==========================
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const q = query(
        collection(db, "products"),
        where("isActive", "==", true)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => {
  const product = {
    id: doc.id,
    ...doc.data(),
  };

 if (product.name === "Murunga Leaf Health Mix") {
  console.log(
    "MURUNGA KEYS:",
    Object.keys(product)
  );

  console.log(
    "MURUNGA JSON:",
    JSON.stringify(product, null, 2)
  );
}

  return product;
});

console.table(
  data.map((p) => ({
    id: p.id,
    name: p.name,
    tamilName: p.tamilName,
  }))
);

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
// ==========================
// DEBUG PRODUCTS
// ==========================
useEffect(() => {
  console.log("Products:", products);

  console.table(
    products.map((p) => ({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
    }))
  );
}, [products]);

  // ==========================
  // FETCH COUPONS
  // ==========================
  useEffect(() => {
    const fetchCoupons = async () => {
      const snap = await getDocs(
        collection(db, "coupons")
      );

      const data =
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setCoupons(data);
    };

    fetchCoupons();
  }, []);

  // ==========================
  // OFFER CONFIG
  // ==========================
  const OFFER_CONFIG = {
    name: "Launching Offer",
    type: "PERCENT",
    value: 10,
    isActive: true,
  };

  const getOfferPrice = (price) => {
    const safePrice =
      Number(price) || 0;

    if (!OFFER_CONFIG.isActive)
      return safePrice;

    return (
      safePrice -
      (safePrice *
        OFFER_CONFIG.value) /
        100
    );
  };

  // ==========================
  // ADD TO CART
  // ==========================
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
      item.weight === variant.weight
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
      name: product.name,
      image: product.images?.[0] || "",
      weight: variant?.weight || "",
      mrp: Number(variant?.price) || 0,
      qty: 1,
    },
  ]);
};
  // ==========================
  // REMOVE FROM CART
  // ==========================
  const removeFromCart = (
    index
  ) => {
    const updated = [...cart];

    updated.splice(index, 1);

    setCart(updated);
  };

  // ==========================
  // TOTALS
  // ==========================
  const totalPrice =
    cart.reduce(
      (total, item) =>
        total +
        getOfferPrice(
          item.mrp
        ) *
          item.qty,
      0
    );

  const discount =
    appliedCoupon
      ? appliedCoupon.type ===
        "PERCENT"
        ? (totalPrice *
            appliedCoupon.value) /
          100
        : appliedCoupon.value
      : 0;

  const finalPrice =
    totalPrice - discount;

  // ==========================
  // APPLY COUPON
  // ==========================
  const applyCoupon = (
    code
  ) => {
    const coupon =
      coupons.find(
        (c) =>
          c.code.toLowerCase() ===
          code.toLowerCase()
      );

    if (!coupon)
      return alert(
        "Invalid coupon"
      );

    setAppliedCoupon(coupon);
  };

  // ==========================
  // CATEGORY LIST
  // ==========================
  const categories = [
    "All",
    ...new Set(
      products
        .map((p) => p.category)
        .filter(Boolean)
    ),
  ];

  const subcategories = [
    "All",
    ...new Set(
      products
        .filter(
          (p) =>
            selectedCategory ===
              "All" ||
            p.category ===
              selectedCategory
        )
        .map(
          (p) =>
            p.subcategory
        )
        .filter(Boolean)
    ),
  ];

  // ==========================
  // FILTER PRODUCTS
  // ==========================
  const filteredProducts =
    products.filter((p) => {
      const categoryMatch =
        selectedCategory ===
          "All" ||
        p.category ===
          selectedCategory;

      const subcategoryMatch =
        selectedSubcategory ===
          "All" ||
        p.subcategory ===
          selectedSubcategory;

      return (
        categoryMatch &&
        subcategoryMatch
      );
    });

  return (
    <div
      className={
        darkMode
          ? "bg-[#101510] text-white min-h-screen"
          : "bg-[#F8F7F2] text-gray-800 min-h-screen"
      }
    >
      <Navbar
  darkMode={darkMode}
  setDarkMode={setDarkMode}
  language={language}
  setLanguage={setLanguage}
  cartCount={cart.length}
  categories={categories}
  setSelectedCategory={setSelectedCategory}
  setSelectedSubcategory={setSelectedSubcategory}
/>

      <section id="home">
        <Hero
          language={language}
          MurungabannerImage={
            MurungabannerImage
          }
          BananabannerImage={
            BananabannerImage
          }
        />
      </section>

      <Features />

      {/* CATEGORY FILTER */}
      <section className="max-w-7xl mx-auto px-6 pt-10">

        <h2 className="text-3xl font-bold mb-5">
          Shop By Category
        </h2>

        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map(
            (cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(
                    cat
                  );
                  setSelectedSubcategory(
                    "All"
                  );
                }}
                className={`px-5 py-2 rounded-full ${
                  selectedCategory ===
                  cat
                    ? "bg-green-600 text-white"
                    : "bg-white border"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {subcategories.map(
            (sub) => (
              <button
                key={sub}
                onClick={() =>
                  setSelectedSubcategory(
                    sub
                  )
                }
                className={`px-4 py-2 rounded-full ${
                  selectedSubcategory ===
                  sub
                    ? "bg-orange-500 text-white"
                    : "bg-white border"
                }`}
              >
                {sub}
              </button>
            )
          )}
        </div>

      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <ProductGrid
          products={
            filteredProducts
          }
          addToCart={
            addToCart
          }
        />
      </section>

      {/* CART */}
      <section
        id="cart"
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <Suspense
          fallback={
            <div>
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

      <section id="about">
        <About />
      </section>

      <FAQ />

      <Suspense
        fallback={
          <div>
            Loading Testimonials...
          </div>
        }
      >
        <Testimonials />
      </Suspense>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </div>
  );
}