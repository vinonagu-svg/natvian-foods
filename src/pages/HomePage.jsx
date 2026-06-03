import { useState, useEffect, Suspense, lazy } from "react";
import { collection, getDocs } from "firebase/firestore";
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

// Lazy components
const Cart = lazy(() => import("../components/Cart"));
const Testimonials = lazy(() => import("../components/Testimonials"));

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
    };

    fetchProducts();
  }, []);

  // FETCH COUPONS
  useEffect(() => {
    const fetchCoupons = async () => {
      const snap = await getDocs(collection(db, "coupons"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCoupons(data);
    };

    fetchCoupons();
  }, []);

  // OFFER CONFIG
  const OFFER_CONFIG = {
    name: "Launching Offer",
    type: "PERCENT",
    value: 10,
    isActive: true,
  };

  // OFFER PRICE
  const getOfferPrice = (price) => {
    const safePrice = Number(price) || 0;

    if (!OFFER_CONFIG.isActive) return safePrice;

    if (OFFER_CONFIG.type === "PERCENT") {
      return safePrice - (safePrice * OFFER_CONFIG.value) / 100;
    }

    if (OFFER_CONFIG.type === "FIXED") {
      return safePrice - OFFER_CONFIG.value;
    }

    return safePrice;
  };

  // ADD TO CART
  const addToCart = (product, variant) => {
    const safeVariant = {
      weight: variant?.weight || "100g",
      price: Number(variant?.price) || 0,
    };

    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.weight === safeVariant.weight
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
        image: product.imageUrl || product.images?.[0] || "",
        weight: safeVariant.weight,
        mrp: safeVariant.price,
        qty: 1,
      },
    ]);
  };

  // REMOVE FROM CART
  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // TOTAL PRICE
  const totalPrice = cart.reduce((total, item) => {
    const mrp = Number(item.mrp) || 0;
    const qty = Number(item.qty) || 1;
    return total + getOfferPrice(mrp) * qty;
  }, 0);

  // COUPON VALIDATION
  const isCouponValid = (coupon) => {
    const today = new Date();

    const expiry = coupon.expiryDate?.toDate
      ? coupon.expiryDate.toDate()
      : new Date(coupon.expiryDate);

    return coupon.isActive === true && expiry >= today;
  };

  const discount = appliedCoupon
    ? appliedCoupon.type === "PERCENT"
      ? (totalPrice * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;

  const finalPrice = totalPrice - discount;

  // APPLY COUPON
  const applyCoupon = (code) => {
    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );

    if (!coupon) return alert("Invalid coupon");

    if (!isCouponValid(coupon)) return alert("Coupon expired or inactive");

    if (totalPrice < coupon.minCartValue)
      return alert(`Minimum cart value is ₹${coupon.minCartValue}`);

    setAppliedCoupon(coupon);
  };

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
      />

      <section id="home">
        <Hero
          language={language}
          MurungabannerImage={MurungabannerImage}
          BananabannerImage={BananabannerImage}
        />
      </section>

      <Features />

      <section id="products" className="max-w-7xl mx-auto px-6 py-20">
        <ProductGrid products={products} addToCart={addToCart} />
      </section>

      {/* CART */}
      <section id="cart" className="max-w-7xl mx-auto px-6 py-20">
        <Suspense fallback={<div>Loading Cart...</div>}>
          <Cart
            cart={cart}
            setCart={setCart}
            removeFromCart={removeFromCart}
            totalPrice={totalPrice}
            finalPrice={finalPrice}
            discount={discount}
            applyCoupon={applyCoupon}
            appliedCoupon={appliedCoupon}
          />
        </Suspense>
      </section>

      <section id="about">
        <About />
      </section>

      <FAQ />

      <Suspense fallback={<div>Loading Testimonials...</div>}>
        <Testimonials />
      </Suspense>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </div>
  );
}