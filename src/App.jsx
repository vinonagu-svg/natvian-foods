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
const Cart = lazy(() => import("./components/Cart"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

// =========================
// IMAGES
// =========================
import MurungabannerImage from "./assets/Murunga-banner.webp";
import BananabannerImage from "./assets/Bloom-banner.webp";

// =========================
// PROTECTED ROUTE
// =========================
function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("admin") === "true";
  return isAdmin ? children : <Navigate to="/admin" />;
}

// =========================
// HOME PAGE
// =========================
function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  // =========================
  // COUPON STATES (NEW)
  // =========================
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // =========================
  // FETCH PRODUCTS
  // =========================
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

  // =========================
  // FETCH COUPONS (NEW)
  // =========================
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

  // =========================
  // ADD TO CART
  // =========================
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
        image: product.imageUrl,
        weight: safeVariant.weight,
        mrp: safeVariant.price,
        qty: 1,
      },
    ]);
  };

  // =========================
  // REMOVE FROM CART
  // =========================
  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // =========================
  // TOTAL PRICE
  // =========================
  const totalPrice = cart.reduce((total, item) => {
    const mrp = Number(item.mrp) || 0;
    const qty = Number(item.qty) || 1;

    return total + getOfferPrice(mrp) * qty;
  }, 0);

  // =========================
  // COUPON LOGIC (NEW)
  // =========================
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

  // =========================
  // APPLY COUPON FUNCTION (used inside Cart)
  // =========================
  const applyCoupon = (code) => {
    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );

    if (!coupon) {
      alert("Invalid coupon");
      return;
    }

    if (!isCouponValid(coupon)) {
      alert("Coupon expired or inactive");
      return;
    }

    if (totalPrice < coupon.minCartValue) {
      alert(`Minimum cart value is ₹${coupon.minCartValue}`);
      return;
    }

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

      <Hero
        language={language}
        MurungabannerImage={MurungabannerImage}
        BananabannerImage={BananabannerImage}
      />

      <Features />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <ProductGrid products={products} addToCart={addToCart} />
      </section>

      {/* CART SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Suspense fallback={<div>Loading Cart...</div>}>
          <Cart
            cart={cart}
            setCart={setCart}
            removeFromCart={removeFromCart}
            totalPrice={totalPrice}
            finalPrice={finalPrice}        // ✅ NEW
            discount={discount}            // ✅ NEW
            applyCoupon={applyCoupon}      // ✅ NEW
            appliedCoupon={appliedCoupon}  // ✅ NEW
          />
        </Suspense>
      </section>

      <About />
      <FAQ />

      <Suspense fallback={<div>Loading Testimonials...</div>}>
        <Testimonials />
      </Suspense>

      <Contact />
      <Footer />
    </div>
  );
}

// =========================
// ROUTER
// =========================
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/admin" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />

      <Route
        path="/admin/products"
        element={<ProtectedRoute><Products /></ProtectedRoute>}
      />

      <Route
        path="/admin/orders"
        element={<ProtectedRoute><Orders /></ProtectedRoute>}
      />

      <Route
        path="/admin/analytics"
        element={<ProtectedRoute><Analytics /></ProtectedRoute>}
      />

      <Route
        path="/admin/coupons"
        element={<ProtectedRoute><Coupons /></ProtectedRoute>}
      />

      <Route
        path="/admin/settings"
        element={<ProtectedRoute><Settings /></ProtectedRoute>}
      />
    </Routes>
  );
}