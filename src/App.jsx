import { useState } from "react";
import { products } from "./data/products";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ProductGrid from "./components/ProductGrid";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

import MurungabannerImage from "./assets/Murunga-banner.png";
import BananabannerImage from "./assets/Bloom-banner.png";

export default function App() {

  // =========================
  // 🌙 DARK MODE
  // =========================
  const [darkMode, setDarkMode] =
    useState(false);

  // =========================
  // 🌐 LANGUAGE
  // =========================
  const [language, setLanguage] =
    useState("en");

  // =========================
  // 🛒 CART
  // =========================
  const [cart, setCart] =
    useState([]);

  // =========================
  // 🎉 OFFER CONFIG
  // =========================
  const OFFER_CONFIG = {
    name: "Launching Offer",
    type: "PERCENT",
    value: 10,
    isActive: true
  };

  // =========================
  // 💰 OFFER PRICE FUNCTION
  // =========================
  const getOfferPrice = (mrp) => {

    const price =
      Number(mrp) || 0;

    if (!OFFER_CONFIG.isActive) {
      return price;
    }

    if (OFFER_CONFIG.type === "PERCENT") {

      return (
        price -
        (price * OFFER_CONFIG.value) / 100
      );
    }

    if (OFFER_CONFIG.type === "FIXED") {

      return (
        price -
        OFFER_CONFIG.value
      );
    }

    return price;
  };

  // =========================
  // ➕ ADD TO CART
  // =========================
  const addToCart = (
    product,
    variant
  ) => {

    console.log(
      "PRODUCT:",
      product
    );

    console.log(
      "VARIANT:",
      variant
    );

    // ✅ SAFETY
    const safeVariant = {

      weight:
        variant?.weight || "100g",

      mrp:
        Number(variant?.mrp) || 0
    };

    // ✅ CHECK EXISTING
    const existingIndex =
      cart.findIndex(
        (item) =>

          item.id === product.id &&
          item.weight === safeVariant.weight
      );

    // =========================
    // ✅ PRODUCT ALREADY EXISTS
    // =========================
    if (existingIndex !== -1) {

      const updatedCart =
        [...cart];

      updatedCart[
        existingIndex
      ].qty += 1;

      setCart(updatedCart);

      return;
    }

    // =========================
    // ✅ NEW PRODUCT
    // =========================
    setCart((prev) => [

      ...prev,

      {
        id: product.id,

        name: product.name,

        image: product.image,

        weight:
          safeVariant.weight,

        mrp:
          safeVariant.mrp,

        qty: 1
      }

    ]);
  };

  // =========================
  // ❌ REMOVE FROM CART
  // =========================
  const removeFromCart = (
    index
  ) => {

    const updatedCart =
      [...cart];

    updatedCart.splice(
      index,
      1
    );

    setCart(updatedCart);
  };

  // =========================
  // 💰 TOTAL PRICE
  // =========================
  const totalPrice =
    cart.reduce(
      (total, item) => {

        const mrp =
          Number(item.mrp) || 0;

        const qty =
          Number(item.qty) || 1;

        const offerPrice =
          getOfferPrice(mrp);

        return (
          total +
          offerPrice * qty
        );

      },
      0
    );

  return (

    <div
      className={
        darkMode
          ? "bg-[#101510] text-white min-h-screen"
          : "bg-[#F8F7F2] text-gray-800 min-h-screen"
      }
    >

      {/* NAVBAR */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        cartCount={cart.length}
      />

      {/* HERO */}
      <Hero
        language={language}
        MurungabannerImage={
          MurungabannerImage
        }
        BananabannerImage={
          BananabannerImage
        }
      />

      {/* FEATURES */}
      <Features />

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        <ProductGrid
          products={products}
          addToCart={addToCart}
        />

      </div>

      {/* CART */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        <Cart
          cart={cart}
          setCart={setCart}
          removeFromCart={
            removeFromCart
          }
          totalPrice={totalPrice}
          offerConfig={
            OFFER_CONFIG
          }
        />

      </div>

      {/* ABOUT */}
      <About />

      {/* FAQ */}
      <FAQ />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CONTACT */}
      <Contact />

      {/* FOOTER */}
      <Footer />

    </div>
  );
}