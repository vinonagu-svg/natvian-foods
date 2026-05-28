// src/App.jsx

import {
  useState,
  lazy,
  Suspense,
  useEffect,
} from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "./firebase";

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
// ADMIN PAGES
// =========================
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Analytics from "./pages/admin/Analytics";
import Coupons from "./pages/admin/Coupons";
import Settings from "./pages/admin/Settings";

// =========================
// LAZY COMPONENTS
// =========================
const Cart = lazy(() =>
  import("./components/Cart")
);

const Testimonials = lazy(() =>
  import("./components/Testimonials")
);

const AdminLogin = lazy(() =>
  import("./pages/admin/AdminLogin")
);

// =========================
// IMAGES
// =========================
import MurungabannerImage from "./assets/Murunga-banner.webp";

import BananabannerImage from "./assets/Bloom-banner.webp";

// =========================
// PROTECTED ADMIN ROUTE
// =========================
function ProtectedRoute({
  children,
}) {

  const isAdmin =
    localStorage.getItem(
      "admin"
    ) === "true";

  return isAdmin
    ? children
    : <Navigate to="/admin" />;
}

// =========================
// HOME PAGE
// =========================
function HomePage() {

  const [darkMode, setDarkMode] =
    useState(false);

  const [language, setLanguage] =
    useState("en");

  const [cart, setCart] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          const snapshot =
            await getDocs(
              collection(
                db,
                "products"
              )
            );

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setProducts(data);

        } catch (err) {

          console.error(err);
        }
      };

    fetchProducts();

  }, []);

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
    price
  ) => {

    const safePrice =
      Number(price) || 0;

    if (
      !OFFER_CONFIG.isActive
    ) {

      return safePrice;
    }

    if (
      OFFER_CONFIG.type ===
      "PERCENT"
    ) {

      return (
        safePrice -
        (
          safePrice *
          OFFER_CONFIG.value
        ) / 100
      );
    }

    if (
      OFFER_CONFIG.type ===
      "FIXED"
    ) {

      return (
        safePrice -
        OFFER_CONFIG.value
      );
    }

    return safePrice;
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

      price:
        Number(
          variant?.price
        ) || 0,
    };

    const existingIndex =
      cart.findIndex(
        (item) =>

          item.id ===
            product.id &&

          item.weight ===
            safeVariant.weight
      );

    // EXISTING
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

    // NEW
    setCart((prev) => [

      ...prev,

      {
        id: product.id,
        name: product.name,
        image:
          product.imageUrl,

        weight:
          safeVariant.weight,

        mrp:
          safeVariant.price,

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

      {/* HERO */}
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

      {/* FEATURES */}
      <Features />

      {/* PRODUCTS */}
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

      {/* CART */}
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

      {/* ABOUT */}
      <section id="about">
        <About />
      </section>

      {/* FAQ */}
      <FAQ />

      {/* TESTIMONIALS */}
      <Suspense
        fallback={
          <div className="text-center py-20 text-2xl font-bold">
            Loading Testimonials...
          </div>
        }
      >

        <Testimonials />

      </Suspense>

      {/* CONTACT */}
      <section id="contact">
        <Contact />
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

// =========================
// APP ROUTER
// =========================
export default function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/admin"
        element={

          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen text-2xl font-bold">
                Loading Admin...
              </div>
            }
          >

            <AdminLogin />

          </Suspense>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/coupons"
        element={
          <ProtectedRoute>
            <Coupons />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}