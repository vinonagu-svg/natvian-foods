import { useState, useEffect } from "react";
import { db } from "../firebase";

import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Cart({
  cart,
  setCart,
  removeFromCart,
}) {

  // =========================
  // CUSTOMER DETAILS
  // =========================
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [state, setState] =
    useState("Tamil Nadu");

  // =========================
  // COUPON STATE
  // =========================
  const [coupon, setCoupon] =
    useState("");

  const [couponDiscount,
    setCouponDiscount] =
    useState(0);

  const [appliedCoupon,
    setAppliedCoupon] =
    useState(null);

  const [availableCoupons,
    setAvailableCoupons] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  // =========================
  // FETCH ACTIVE COUPONS
  // =========================
  useEffect(() => {

    const fetchCoupons =
      async () => {

        try {

          const snap =
            await getDocs(
              collection(db, "coupons")
            );

          const data =
            snap.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter(
                (c) =>
                  c.isActive === true
              );

          setAvailableCoupons(data);

        } catch (err) {

          console.error(
            "Coupon fetch error:",
            err
          );
        }
      };

    fetchCoupons();

  }, []);

  // =========================
  // REMOVE AUTO 10% OFFER
  // =========================
  const getPrice = (mrp) => {
    return Number(mrp) || 0;
  };

  // =========================
  // TOTALS
  // =========================
  const mrpTotal = cart.reduce(
    (sum, item) =>
      sum +
      getPrice(item.mrp) *
      Number(item.qty || 1),
    0
  );

  // NO PRODUCT DISCOUNT
  const offerTotal = mrpTotal;

  // =========================
  // RESET COUPON
  // =========================
  useEffect(() => {

    setCoupon("");
    setCouponDiscount(0);
    setAppliedCoupon(null);

  }, [cart]);

  // =========================
  // APPLY COUPON
  // =========================
  const applyCoupon = () => {

    const code =
      coupon.trim().toUpperCase();

    const found =
      availableCoupons.find(
        (c) =>
          c.code?.toUpperCase() ===
          code
      );

    // INVALID
    if (!found) {

      setCouponDiscount(0);

      alert("Invalid Coupon ❌");

      return;
    }

    // EXPIRED
    const expiryDate =
      found.expiryDate?.seconds
        ? new Date(
            found.expiryDate.seconds *
              1000
          )
        : new Date(
            found.expiryDate
          );

    if (
      expiryDate <
      new Date()
    ) {

      setCouponDiscount(0);

      alert("Coupon Expired ⛔");

      return;
    }

    // MIN CART CHECK
    const minCart =
      Number(
        found.minCartValue || 0
      );

    if (
      offerTotal < minCart
    ) {

      setCouponDiscount(0);

      alert(
        `Minimum cart value ₹${minCart} required`
      );

      return;
    }

    // DISCOUNT
    let discount = 0;

    if (
      found.type === "PERCENT"
    ) {

      discount =
        (offerTotal *
          Number(found.value)) /
        100;

    } else {

      discount =
        Number(found.value || 0);
    }

    // PREVENT NEGATIVE TOTAL
    if (
      discount > offerTotal
    ) {

      discount =
        offerTotal;
    }

    setCouponDiscount(discount);

    setAppliedCoupon(
      found.code
    );

    alert("Coupon Applied ✅");
  };

  // =========================
  // REMOVE COUPON
  // =========================
  const removeCoupon =
    () => {

      setCoupon("");
      setCouponDiscount(0);
      setAppliedCoupon(null);
    };

  // =========================
  // GST
  // =========================
  const finalAfterCoupon =
    Math.max(
      offerTotal -
        couponDiscount,
      0
    );

  const GST_PERCENT = 5;

  const totalGST =
    finalAfterCoupon *
    (GST_PERCENT / 100);

  const cgst =
    totalGST / 2;

  const sgst =
    totalGST / 2;

  // =========================
  // SHIPPING
  // =========================
  let shipping = 0;

  if (
    finalAfterCoupon >= 999
  ) {

    shipping = 0;

  } else {

    shipping =
      state === "Tamil Nadu"
        ? 60
        : 100;
  }

  const grandTotal =
    finalAfterCoupon +
    shipping;

  // =========================
  // QUANTITY CONTROL
  // =========================
  const increaseQty =
    (i) => {

      const updated = [...cart];

      updated[i].qty += 1;

      setCart(updated);
    };

  const decreaseQty =
    (i) => {

      const updated = [...cart];

      if (
        updated[i].qty > 1
      ) {

        updated[i].qty -= 1;
      }

      setCart(updated);
    };
// =========================
// RAZORPAY PAYMENT
// =========================
const handlePayment = async () => {

  try {

    if (!customer.name) {
      alert("Please enter your name");
      return;
    }

    if (!customer.phone) {
      alert("Please enter your phone number");
      return;
    }

    if (!customer.address) {
      alert("Please enter your address");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    const options = {

      key:
        import.meta.env
          .VITE_RAZORPAY_KEY_ID,

        amount: Math.round(grandTotal * 100),

      currency: "INR",

      name: "Natvian Foods",

      description:
        "Online Order",

      prefill: {

        name:
          customer.name,

        contact:
          customer.phone,
      },

      notes: {

        address:
          customer.address,
      },

      theme: {
        color: "#31572C",
      },

      handler:
        async function (
          response
        ) {

          try {

            const orderNumber =
              "NF-" +
              Date.now();

              console.log("Customer", customer);
              console.log("Cart", cart);
              console.log("Applied Coupon", appliedCoupon);
              console.log("Payment Response", response);

            await addDoc(collection(db, "orders"), {
             orderNumber: orderNumber || "",

             customer: {
             name: customer.name || "",
             phone: customer.phone || "",
             address: customer.address || "",
             city: customer.city || "",
             pincode: customer.pincode || "",
            },

             items: cart.map((item) => ({
             id: item.id || "",
             name: item.name || "",
             weight: item.weight || "",
             mrp: item.mrp || 0,
             qty: item.qty || 1,
            })),

             subtotal: Number(mrpTotal) || 0,
             couponDiscount: Number(couponDiscount) || 0,
             shipping: Number(shipping) || 0,
              cgst: Number(cgst) || 0,
              sgst: Number(sgst) || 0,
              grandTotal: Number(grandTotal) || 0,

              coupon: appliedCoupon || "",

              paymentId: response?.razorpay_payment_id || "",

              paymentStatus: "PAID",
              orderStatus: "pending",

             createdAt: serverTimestamp(),
          });

            alert(
              "Payment Successful ✅"
            );

            setCart([]);

          } catch (error) {
            console.error("FULL ERROR:", error);
            console.error("ERROR CODE:", error.code);
            console.error("ERROR MESSAGE:", error.message);

           alert(
            `Order save failed:
            ${error.code}
            ${error.message}`
            );
          }
        },
    };

    const razorpay =
      new window.Razorpay(
        options
      );

    razorpay.on(
      "payment.failed",
      function (
        response
      ) {

        console.error(
          response
        );

        alert(
          response.error
            ?.description ||
            "Payment Failed"
        );
      }
    );

    razorpay.open();

  } catch (error) {

    console.error(
      error
    );

    alert(
      "Unable to start payment"
    );
  }
};
  // =========================
  // EMPTY CART
  // =========================
  if (cart.length === 0) {

    return (
      <section className="max-w-4xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8 text-[#31572C]">
          Shopping Cart
        </h1>

        <div className="bg-white p-10 rounded-3xl shadow text-center">

          <h2 className="text-2xl font-bold mb-3">
            Your cart is empty
          </h2>

          <p className="text-gray-500">
            Add products to continue shopping
          </p>

        </div>

      </section>
    );
  }

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

              <h3 className="font-bold text-lg">
                {item.name}
              </h3>

              <p className="text-gray-500">
                {item.weight}
              </p>

              <p className="font-bold text-green-700 mt-1">
                ₹
                {getPrice(
                  item.mrp
                ).toFixed(2)}
              </p>

            </div>

            <div className="flex gap-3 items-center">

              <button
                onClick={() =>
                  decreaseQty(i)
                }
                className="w-8 h-8 bg-gray-200 rounded-full"
              >
                -
              </button>

              <span className="font-bold">
                {item.qty}
              </span>

              <button
                onClick={() =>
                  increaseQty(i)
                }
                className="w-8 h-8 bg-gray-200 rounded-full"
              >
                +
              </button>

              <button
                onClick={() =>
                  removeFromCart(i)
                }
                className="text-red-500 ml-3"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* CUSTOMER DETAILS */}
      <div className="mt-10 bg-white p-6 rounded-3xl shadow">

        <h2 className="text-2xl font-bold mb-5">
          Customer Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded-xl"
            value={customer.name}
            onChange={(e) =>
              setCustomer({
                ...customer,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="border p-3 rounded-xl"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="City"
            className="border p-3 rounded-xl"
            value={customer.city}
            onChange={(e) =>
              setCustomer({
                ...customer,
                city: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Pincode"
            className="border p-3 rounded-xl"
            value={customer.pincode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                pincode:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Address"
            className="border p-3 rounded-xl md:col-span-2"
            rows={4}
            value={customer.address}
            onChange={(e) =>
              setCustomer({
                ...customer,
                address:
                  e.target.value,
              })
            }
          />

        </div>

      </div>

      {/* COUPON */}
      <div className="mt-8 bg-white p-6 rounded-3xl shadow">

        <h2 className="text-2xl font-bold mb-4">
          Apply Coupon
        </h2>

        <div className="flex gap-3">

          <select
            className="border p-3 rounded-xl flex-1"
            value={coupon}
            onChange={(e) =>
              setCoupon(
                e.target.value
              )
            }
          >

            <option value="">
              Select Coupon
            </option>

            {availableCoupons.map(
              (c) => (

                <option
                  key={c.id}
                  value={c.code}
                >
                  {c.code}
                </option>

              )
            )}

          </select>

          <button
            onClick={applyCoupon}
            className="bg-black text-white px-6 rounded-xl"
          >
            Apply
          </button>

        </div>

        {appliedCoupon && (

          <div className="mt-4 flex items-center gap-4">

            <p className="text-green-700 font-semibold">
              Coupon Applied:
              {" "}
              {appliedCoupon}
            </p>

            <button
              onClick={
                removeCoupon
              }
              className="text-red-500"
            >
              Remove Coupon
            </button>

          </div>

        )}

      </div>

      {/* ORDER SUMMARY */}
      <div className="mt-10 bg-white p-6 rounded-3xl shadow">

        <h2 className="text-2xl font-bold mb-5">
          Order Summary
        </h2>

        <div className="space-y-2 text-lg">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              ₹
              {mrpTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-red-500">
            <span>
              Coupon Discount
            </span>

            <span>
              -₹
              {couponDiscount.toFixed(
                2
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>CGST</span>
            <span>
              ₹{cgst.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>SGST</span>
            <span>
              ₹{sgst.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              ₹{shipping}
            </span>
          </div>

        </div>

        <div className="border-t mt-5 pt-5 flex justify-between items-center">

          <h2 className="text-3xl font-bold">
            Grand Total
          </h2>

          <h2 className="text-3xl font-bold text-[#31572C]">
            ₹
            {grandTotal.toFixed(2)}
          </h2>

        </div>

        {/* PAYMENT BUTTON */}
        <button
        onClick={handlePayment}
        className="w-full mt-6 bg-[#31572C] hover:bg-[#264653] text-white py-4 rounded-2xl text-lg font-bold"
        >
  Proceed to Pay
</button>
    </div>

    </section>
  );
}