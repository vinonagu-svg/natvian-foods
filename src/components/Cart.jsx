import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Cart({
  cart,
  setCart,
  removeFromCart,
}) {
  // =========================
  // COMPANY DETAILS
  // =========================
  const COMPANY = {
    name: "Natvian Foods",
    address:
      "3/147A, Chettiyar Thottam, Periyathiottampudur, Karamadai Block, Coimbatore, Tamil Nadu - 638459",
    gstin: "33ATHPN4463C1ZW",
    fssai: "22426402000209",
    pan: "ATHPN4463C",
    phone: "+91 9788857645",
    website: "https://www.thenativefood.com",
  };

  // =========================
  // CUSTOMER (future use)
  // =========================
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [state, setState] = useState("Tamil Nadu");

  // =========================
  // COUPON STATE
  // =========================
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH COUPONS FROM FIREBASE
  // =========================
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const snap = await getDocs(collection(db, "coupons"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAvailableCoupons(data);
      } catch (err) {
        console.error("Coupon fetch error:", err);
      }
    };

    fetchCoupons();
  }, []);

  // =========================
  // OFFER PRICE (PRODUCT DISCOUNT)
  // =========================
  const OFFER = 10;

  const getOfferPrice = (mrp) => {
    const price = Number(mrp) || 0;
    return price - (price * OFFER) / 100;
  };

  // =========================
  // TOTALS
  // =========================
  const mrpTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.mrp || 0) * Number(item.qty || 1),
    0
  );

  const offerTotal = cart.reduce(
    (sum, item) =>
      sum + getOfferPrice(item.mrp) * Number(item.qty || 1),
    0
  );

  const finalAfterCoupon = Math.max(
    offerTotal - couponDiscount,
    0
  );

  // =========================
  // AUTO RESET COUPON WHEN CART CHANGES
  // =========================
  useEffect(() => {
    setCoupon("");
    setCouponDiscount(0);
  }, [cart]);

  // =========================
  // APPLY COUPON (FULL SAFE LOGIC)
  // =========================
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    const found = availableCoupons.find(
      (c) => c.code?.toUpperCase() === code
    );

    if (!found) {
      setCouponDiscount(0);
      alert("Invalid Coupon ❌");
      return;
    }

    // Firestore timestamp safe conversion
    const expiryDate =
      found.expiryDate?.seconds
        ? new Date(found.expiryDate.seconds * 1000)
        : new Date(found.expiryDate);

    if (!expiryDate || expiryDate < new Date()) {
      setCouponDiscount(0);
      alert("Coupon Expired ⛔");
      return;
    }

    // Min cart validation
    const minCart = Number(found.minCartValue || 0);

    if (offerTotal < minCart) {
      setCouponDiscount(0);
      alert(`Minimum cart value ₹${minCart} required`);
      return;
    }

    let discount = 0;

    if (found.type === "PERCENT") {
      discount = (offerTotal * Number(found.value)) / 100;
    } else {
      discount = Number(found.value || 0);
    }

    setCouponDiscount(discount);
    alert("Coupon Applied ✅");
  };

  // =========================
  // SHIPPING
  // =========================
  let shipping = 0;

  if (finalAfterCoupon >= 999) {
    shipping = 0;
  } else {
    shipping = state === "Tamil Nadu" ? 60 : 100;
  }

  const grandTotal = finalAfterCoupon + shipping;

  // =========================
  // QUANTITY CONTROL
  // =========================
  const increaseQty = (i) => {
    const updated = [...cart];
    updated[i].qty += 1;
    setCart(updated);
  };

  const decreaseQty = (i) => {
    const updated = [...cart];
    if (updated[i].qty > 1) updated[i].qty -= 1;
    setCart(updated);
  };

  // =========================
  // UI
  // =========================
  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-[#31572C]">
        Shopping Cart
      </h1>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {cart.map((item, i) => (
          <div
            key={i}
            className="border rounded-2xl p-4 flex justify-between bg-white"
          >
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p>{item.weight}</p>
              <p className="line-through">₹{item.mrp}</p>
              <p className="text-green-600 font-bold">
                ₹{getOfferPrice(item.mrp).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <button onClick={() => decreaseQty(i)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => increaseQty(i)}>+</button>

              <button
                onClick={() => removeFromCart(i)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COUPON */}
      <div className="mt-6 flex gap-3">
        <select
          className="border p-3 rounded-xl flex-1"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        >
          <option value="">Select Coupon</option>

          {availableCoupons.map((c) => (
            <option key={c.id} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>

        <button
          onClick={applyCoupon}
          className="bg-black text-white px-6 rounded-xl"
        >
          Apply
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mt-10 bg-white p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-4">
          Order Summary
        </h2>

        <p>MRP: ₹{mrpTotal.toFixed(2)}</p>
        <p>Offer: ₹{offerTotal.toFixed(2)}</p>
        <p className="text-red-500">
          Coupon: -₹{couponDiscount.toFixed(2)}
        </p>
        <p>Shipping: ₹{shipping}</p>

        <h2 className="text-3xl font-bold mt-4">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </h2>
      </div>
    </section>
  );
}