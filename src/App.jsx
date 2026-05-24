import {
  useState,
  lazy,
  Suspense,
} from "react";

import { products } from "./data/products";

// =========================
// NORMAL COMPONENTS
// =========================
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ProductGrid from "./components/ProductGrid";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// =========================
// LAZY LOADED COMPONENTS
// =========================
const Cart = lazy(() =>
  import("./components/Cart")
);

const Testimonials = lazy(() =>
  import("./components/Testimonials")
);

const AdminDashboard = lazy(() =>
  import("./components/AdminDashboard")
);

const AdminLogin = lazy(() =>
  import("./components/AdminLogin")
);

// =========================
// WEBP IMAGES
// =========================
import MurungabannerImage from "./assets/Murunga-banner.webp";

import BananabannerImage from "./assets/Bloom-banner.webp";

export default function App() {

  // =========================
  // ADMIN MODE
  // =========================
  const [isAdmin, setIsAdmin] =
    useState(
      localStorage.getItem(
        "isAdmin"
      ) === "true"
    );

  // =========================
  // DARK MODE
  // =========================
  const [darkMode, setDarkMode] =
    useState(false);

  // =========================
  // LANGUAGE
  // =========================
  const [language, setLanguage] =
    useState("en");

  // =========================
  // CART
  // =========================
  const [cart, setCart] =
    useState([]);

  // =========================
  // OFFER CONFIG
  // =========================
  const OFFER_CONFIG = {

    name: "Launching Offer",

    type: "PERCENT",

    value: 10,

    isActive: true,
  };

  // =========================
  // OFFER PRICE
  // =========================
  const getOfferPrice = (
    mrp
  ) => {

    const price =
      Number(mrp) || 0;

    if (
      !OFFER_CONFIG.isActive
    ) {

      return price;
    }

    // PERCENT OFFER
    if (
      OFFER_CONFIG.type ===
      "PERCENT"
    ) {

      return (
        price -
        (
          price *
          OFFER_CONFIG.value
        ) / 100
      );
    }

    // FIXED OFFER
    if (
      OFFER_CONFIG.type ===
      "FIXED"
    ) {

      return (
        price -
        OFFER_CONFIG.value
      );
    }

    return price;
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (
    product,
    variant
  ) => {

    const safeVariant = {

      weight:
        variant?.weight ||
        "100g",

      mrp:
        Number(
          variant?.mrp
        ) || 0,
    };

    // CHECK EXISTING PRODUCT
    const existingIndex =
      cart.findIndex(
        (item) =>

          item.id ===
            product.id &&

          item.weight ===
            safeVariant.weight
      );

    // PRODUCT EXISTS
    if (
      existingIndex !== -1
    ) {

      const updatedCart =
        [...cart];

      updatedCart[
        existingIndex
      ].qty += 1;

      setCart(updatedCart);

      return;
    }

    // NEW PRODUCT
    setCart((prev) => [

      ...prev,

      {

        id: product.id,

        name:
          product.name,

        image:
          product.image,

        weight:
          safeVariant.weight,

        mrp:
          safeVariant.mrp,

        qty: 1,
      },

    ]);
  };

  // =========================
  // REMOVE FROM CART
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
  // TOTAL PRICE
  // =========================
  const totalPrice =
    cart.reduce(
      (total, item) => {

        const mrp =
          Number(
            item.mrp
          ) || 0;

        const qty =
          Number(
            item.qty
          ) || 1;

        const offerPrice =
          getOfferPrice(
            mrp
          );

        return (
          total +
          offerPrice * qty
        );

      },
      0
    );

  // =========================
  // ADMIN PAGE
  // =========================
  if (
    window.location.pathname ===
    "/admin"
  ) {

    return (

      <Suspense
        fallback={

          <div className="flex items-center justify-center min-h-screen text-2xl font-bold">

            Loading Admin Panel...

          </div>
        }
      >

        {isAdmin ? (

          <AdminDashboard />

        ) : (

          <AdminLogin
            setIsAdmin={
              setIsAdmin
            }
          />

        )}

      </Suspense>
    );
  }

  // =========================
  // MAIN WEBSITE
  // =========================
  return (

    <div
      className={
        darkMode

          ? "bg-[#101510] text-white min-h-screen"

          : "bg-[#F8F7F2] text-gray-800 min-h-screen"
      }
    >

      {/* =========================
          NAVBAR
      ========================= */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={
          setDarkMode
        }
        language={language}
        setLanguage={
          setLanguage
        }
        cartCount={
          cart.length
        }
      />

      {/* =========================
          HERO
      ========================= */}
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

      {/* =========================
          FEATURES
      ========================= */}
      <Features />

      {/* =========================
          PRODUCTS
      ========================= */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-6 py-20"
      >

        <ProductGrid
          products={products}
          addToCart={
            addToCart
          }
        />

      </section>

      {/* =========================
          CART
      ========================= */}
      <section
        id="cart"
        className="max-w-7xl mx-auto px-6 py-20"
      >

        <Suspense
          fallback={

            <div className="text-center py-20 text-2xl font-bold">

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
            offerConfig={
              OFFER_CONFIG
            }
          />

        </Suspense>

      </section>

      {/* =========================
          ABOUT
      ========================= */}
      <section id="about">

        <About />

      </section>

      {/* =========================
          FAQ
      ========================= */}
      <FAQ />

      {/* =========================
          TESTIMONIALS
      ========================= */}
      <Suspense
        fallback={

          <div className="text-center py-20 text-2xl font-bold">

            Loading Testimonials...

          </div>
        }
      >

        <Testimonials />

      </Suspense>

      {/* =========================
          CONTACT
      ========================= */}
      <section id="contact">

        <Contact />

      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <Footer />

    </div>
  );
}