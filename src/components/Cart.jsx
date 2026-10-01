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
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [state, setState] = useState("Tamil Nadu");

  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH COUPONS
  // =========================

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const snap = await getDocs(
          collection(db, "coupons")
        );

        const data = snap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((c) => c.isActive === true);

        setAvailableCoupons(data);
      } catch (error) {
        console.error("Coupon fetch error:", error);
      }
    };

    fetchCoupons();
  }, []);

  // =========================
  // GET CART PRICE
  // =========================

  const getPrice = (item) => {
    if (item?.type === "combo") {
      return Number(item.comboPrice || 0);
    }

    return Number(item?.mrp || 0);
  };

  // =========================
  // CONVERT WEIGHT TO KG
  // =========================

  const parseWeightToKg = (weight) => {
    if (weight === null || weight === undefined) {
      return 0;
    }

    const value = String(weight)
      .trim()
      .toLowerCase()
      .replace(/,/g, "");

    if (!value) {
      return 0;
    }

    const numberMatch = value.match(/[\d.]+/);

    if (!numberMatch) {
      return 0;
    }

    const number = Number(numberMatch[0]);

    if (!Number.isFinite(number)) {
      return 0;
    }

    // grams
    if (value.includes("g") && !value.includes("kg")) {
      return number / 1000;
    }

    // kilograms
    if (value.includes("kg")) {
      return number;
    }

    // If no unit is provided:
    // assume the value is already in kg.
    return number;
  };

  // =========================
  // GET TOTAL CART WEIGHT
  // =========================
  //
  // Normal product:
  // item.weight × quantity
  //
  // Combo:
  // component weight × component quantity
  // × combo quantity
  //
  // =========================

  const totalWeightKg = cart.reduce(
    (total, item) => {
      const itemQty = Number(item.qty || 1);

      // COMBO PACK
      if (
        item.type === "combo" &&
        Array.isArray(item.items)
      ) {
        const comboWeight = item.items.reduce(
          (comboTotal, comboItem) => {
            const componentWeight =
              parseWeightToKg(comboItem.weight);

            const componentQty = Number(
              comboItem.quantity || 1
            );

            return (
              comboTotal +
              componentWeight * componentQty
            );
          },
          0
        );

        return (
          total +
          comboWeight * itemQty
        );
      }

      // NORMAL PRODUCT
      const productWeight =
        parseWeightToKg(item.weight);

      return (
        total +
        productWeight * itemQty
      );
    },
    0
  );

  // =========================
  // ROUND WEIGHT UP TO
  // NEXT 1 KG SLAB
  // =========================
  //
  // 0.5 kg  -> 1 kg
  // 1.0 kg  -> 1 kg
  // 1.1 kg  -> 2 kg
  // 2.0 kg  -> 2 kg
  // 2.1 kg  -> 3 kg
  //
  // =========================

  const shippingWeightSlab =
    totalWeightKg > 0
      ? Math.ceil(totalWeightKg)
      : 0;

  // =========================
  // CART TOTAL
  // =========================

  const mrpTotal = cart.reduce(
    (sum, item) => {
      const price = getPrice(item);
      const qty = Number(item.qty || 1);

      return sum + price * qty;
    },
    0
  );

  const offerTotal = mrpTotal;

  // =========================
  // RESET COUPON WHEN CART CHANGES
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
    const code = coupon.trim().toUpperCase();

    if (!code) {
      alert("Please select a coupon");
      return;
    }

    const found = availableCoupons.find(
      (c) =>
        String(c.code || "")
          .trim()
          .toUpperCase() === code
    );

    if (!found) {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      alert("Invalid Coupon");
      return;
    }

    let expiryDate = null;

    if (found.expiryDate?.seconds) {
      expiryDate = new Date(
        found.expiryDate.seconds * 1000
      );
    } else if (found.expiryDate) {
      expiryDate = new Date(found.expiryDate);
    }

    if (
      expiryDate &&
      !isNaN(expiryDate.getTime()) &&
      expiryDate < new Date()
    ) {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      alert("Coupon Expired");
      return;
    }

    const minCart = Number(
      found.minCartValue || 0
    );

    if (offerTotal < minCart) {
      setCouponDiscount(0);
      setAppliedCoupon(null);

      alert(
        `Minimum cart value ₹${minCart} required`
      );

      return;
    }

    let discount = 0;

    if (
      String(found.type || "").toUpperCase() ===
      "PERCENT"
    ) {
      discount =
        (offerTotal * Number(found.value || 0)) /
        100;
    } else {
      discount = Number(found.value || 0);
    }

    if (discount > offerTotal) {
      discount = offerTotal;
    }

    setCouponDiscount(discount);
    setAppliedCoupon(found.code);

    alert("Coupon Applied");
  };

  // =========================
  // REMOVE COUPON
  // =========================

  const removeCoupon = () => {
    setCoupon("");
    setCouponDiscount(0);
    setAppliedCoupon(null);
  };

  // =========================
  // FINAL PRICE AFTER COUPON
  // =========================

  const finalAfterCoupon = Math.max(
    offerTotal - couponDiscount,
    0
  );

  // =========================
  // GST
  // =========================

  const GST_PERCENT = 5;

  const totalGST =
    finalAfterCoupon *
    (GST_PERCENT / (100 + GST_PERCENT));

  const cgst = totalGST / 2;
  const sgst = totalGST / 2;

  const taxableAmount =
    finalAfterCoupon - totalGST;

  // =========================
  // SHIPPING
  // =========================
  //
  // Tamil Nadu:
  // Up to 1 kg = ₹80
  // 1.1 - 2 kg = ₹160
  // 2.1 - 3 kg = ₹240
  //
  // Other states:
  // Up to 1 kg = ₹120
  // 1.1 - 2 kg = ₹240
  // 2.1 - 3 kg = ₹360
  //
  // Free shipping if order value >= ₹999
  //
  // =========================

  let shipping = 0;

  if (finalAfterCoupon >= 999) {
    shipping = 0;
  } else if (shippingWeightSlab > 0) {
    const baseShipping =
      state === "Tamil Nadu"
        ? 80
        : 120;

    shipping =
      shippingWeightSlab * baseShipping;
  }

  // =========================
  // GRAND TOTAL
  // =========================

  const grandTotal =
    finalAfterCoupon + shipping;

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQty = (index) => {
    const updated = [...cart];

    updated[index].qty =
      Number(updated[index].qty || 1) + 1;

    setCart(updated);
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQty = (index) => {
    const updated = [...cart];

    const currentQty = Number(
      updated[index].qty || 1
    );

    if (currentQty > 1) {
      updated[index].qty = currentQty - 1;
    }

    setCart(updated);
  };

  // =========================
  // PAYMENT
  // =========================

  const handlePayment = async () => {
    try {
      if (!customer.name.trim()) {
        alert("Please enter your name");
        return;
      }

      if (!customer.phone.trim()) {
        alert("Please enter your phone number");
        return;
      }

      if (!customer.address.trim()) {
        alert("Please enter your address");
        return;
      }

      if (!customer.city.trim()) {
        alert("Please enter your city");
        return;
      }

      if (!customer.pincode.trim()) {
        alert("Please enter your pincode");
        return;
      }

      if (!state) {
        alert("Please select your state");
        return;
      }

      if (cart.length === 0) {
        alert("Your cart is empty");
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      setLoading(true);

      // =========================
      // PREPARE ORDER ITEMS
      // =========================

      const orderItems = cart.map((item) => {
        const actualPrice = getPrice(item);

        return {
          id: item.id || "",

          name: item.name || "",

          tamilName: item.tamilName || "",

          type: item.type || "product",

          weight: item.weight || "",

          mrp: Number(item.mrp || 0),

          regularPrice: Number(
            item.regularPrice || 0
          ),

          comboPrice: Number(
            item.comboPrice || 0
          ),

          savings: Number(
            item.savings || 0
          ),

          price: Number(actualPrice) || 0,

          qty: Number(item.qty || 1),

          items: Array.isArray(item.items)
            ? item.items
            : [],
        };
      });

      // =========================
      // RAZORPAY
      // =========================

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: Math.round(
          grandTotal * 100
        ),

        currency: "INR",

        name: "Natvian Foods",

        description: "Online Order",

        prefill: {
          name: customer.name,
          contact: customer.phone,
        },

        notes: {
          address: customer.address,
          city: customer.city,
          state: state,
          pincode: customer.pincode,
          coupon: appliedCoupon || "",
          totalWeightKg:
            Number(totalWeightKg.toFixed(3)),
          shippingWeightSlab:
            shippingWeightSlab,
          shippingCharge: shipping,
        },

        theme: {
          color: "#31572C",
        },

        // =========================
        // PAYMENT SUCCESS
        // =========================

        handler: async function (response) {
          try {
            const orderNumber =
              "NF-" + Date.now();

            // =========================
            // SAVE ORDER
            // =========================

            await addDoc(
              collection(db, "orders"),
              {
                orderNumber: orderNumber,

                customer: {
                  name: customer.name || "",
                  phone: customer.phone || "",
                  address: customer.address || "",
                  city: customer.city || "",
                  state: state || "",
                  pincode: customer.pincode || "",
                },

                items: orderItems,

                subtotal:
                  Number(mrpTotal) || 0,

                couponDiscount:
                  Number(couponDiscount) || 0,

                taxableAmount:
                  Number(taxableAmount) || 0,

                totalGST:
                  Number(totalGST) || 0,

                cgst:
                  Number(cgst) || 0,

                sgst:
                  Number(sgst) || 0,

                // SHIPPING DETAILS
                totalWeightKg:
                  Number(totalWeightKg.toFixed(3)),

                shippingWeightSlab:
                  Number(shippingWeightSlab),

                shipping:
                  Number(shipping) || 0,

                grandTotal:
                  Number(grandTotal) || 0,

                coupon:
                  appliedCoupon || "",

                paymentId:
                  response?.razorpay_payment_id || "",

                paymentStatus: "PAID",

                orderStatus: "pending",

                gstIncluded: true,

                gstRate: GST_PERCENT,

                createdAt: serverTimestamp(),
              }
            );

            alert("Payment Successful");

            setCart([]);
          } catch (error) {
            console.error(
              "Order save error:",
              error
            );

            alert(
              `Order save failed:\n${
                error.code || ""
              }\n${error.message || ""}`
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay =
        new window.Razorpay(options);

      // =========================
      // PAYMENT FAILED
      // =========================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response
          );

          setLoading(false);

          alert(
            response.error?.description ||
              "Payment Failed"
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      setLoading(false);

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
  // CART UI
  // =========================

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-[#31572C]">
        Shopping Cart
      </h1>

      {/* CART ITEMS */}

      <div className="space-y-4">
        {cart.map((item, i) => {
          const itemPrice = getPrice(item);

          const isCombo =
            item.type === "combo";

          const regularPrice =
            Number(item.regularPrice || 0);

          const comboPrice =
            Number(item.comboPrice || 0);

          const savings =
            Number(item.savings || 0);

          return (
            <div
              key={
                item.id
                  ? `${item.id}-${i}`
                  : i
              }
              className="border rounded-2xl p-4 flex flex-col md:flex-row md:justify-between gap-4 bg-white"
            >
              {/* ITEM DETAILS */}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">
                    {item.name}
                  </h3>

                  {isCombo && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      Combo
                    </span>
                  )}
                </div>

                {item.weight && (
                  <p className="text-gray-500">
                    {item.weight}
                  </p>
                )}

                {/* PRICE */}

                <div className="mt-1">
                  {isCombo &&
                    regularPrice > comboPrice && (
                      <span className="text-sm text-gray-400 line-through mr-2">
                        ₹{regularPrice.toFixed(2)}
                      </span>
                    )}

                  <span className="font-bold text-green-700">
                    ₹{itemPrice.toFixed(2)}
                  </span>

                  {isCombo && savings > 0 && (
                    <span className="ml-2 text-xs font-semibold text-red-600">
                      Save ₹{savings.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* COMBO ITEMS */}

                {isCombo &&
                  Array.isArray(item.items) &&
                  item.items.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {item.items.map(
                        (comboItem, index) => (
                          <div key={index}>
                            •{" "}
                            {comboItem.productName ||
                              comboItem.name ||
                              "Product"}

                            {comboItem.weight
                              ? ` - ${comboItem.weight}`
                              : ""}

                            {" x "}

                            {comboItem.quantity || 1}
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>

              {/* QUANTITY */}

              <div className="flex gap-3 items-center">
                <button
                  type="button"
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
                  type="button"
                  onClick={() =>
                    increaseQty(i)
                  }
                  className="w-8 h-8 bg-gray-200 rounded-full"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(i)
                  }
                  className="text-red-500 ml-3"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
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
            type="tel"
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

          <select
            className="border p-3 rounded-xl"
            value={state}
            onChange={(e) =>
              setState(e.target.value)
            }
          >
            <option value="">
              Select State
            </option>

            <option value="Tamil Nadu">
              Tamil Nadu
            </option>

            <option value="Karnataka">
              Karnataka
            </option>

            <option value="Kerala">
              Kerala
            </option>

            <option value="Andhra Pradesh">
              Andhra Pradesh
            </option>

            <option value="Telangana">
              Telangana
            </option>

            <option value="Maharashtra">
              Maharashtra
            </option>

            <option value="Delhi">
              Delhi
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          <input
            type="text"
            placeholder="Pincode"
            maxLength={6}
            className="border p-3 rounded-xl"
            value={customer.pincode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                pincode:
                  e.target.value.replace(
                    /\D/g,
                    ""
                  ),
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
                address: e.target.value,
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
              setCoupon(e.target.value)
            }
          >
            <option value="">
              Select Coupon
            </option>

            {availableCoupons.map((c) => (
              <option
                key={c.id}
                value={c.code}
              >
                {c.code}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={applyCoupon}
            className="bg-black text-white px-6 rounded-xl"
          >
            Apply
          </button>
        </div>

        {appliedCoupon && (
          <div className="mt-4 flex items-center gap-4">
            <p className="text-green-700 font-semibold">
              Coupon Applied: {appliedCoupon}
            </p>

            <button
              type="button"
              onClick={removeCoupon}
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
            <span>
              Subtotal (GST Included)
            </span>

            <span>
              ₹{mrpTotal.toFixed(2)}
            </span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>
                Coupon Discount
              </span>

              <span>
                -₹{couponDiscount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-gray-600">
            <span>
              CGST (Included)
            </span>

            <span>
              ₹{cgst.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>
              SGST (Included)
            </span>

            <span>
              ₹{sgst.toFixed(2)}
            </span>
          </div>

          {/* WEIGHT */}

          <div className="flex justify-between text-gray-600">
            <span>
              Total Weight
            </span>

            <span>
              {totalWeightKg.toFixed(3)} kg
            </span>
          </div>

          {/* SHIPPING */}

          <div className="flex justify-between">
            <span>
              Shipping
            </span>

            <span>
              {shipping === 0
                ? "FREE"
                : `₹${shipping.toFixed(2)}`}
            </span>
          </div>

          <p className="text-sm text-gray-500 pt-2">
            GST is already included in the product price.
          </p>

          {finalAfterCoupon < 999 &&
            shippingWeightSlab > 0 && (
              <p className="text-sm text-gray-500">
                {state === "Tamil Nadu"
                  ? `Tamil Nadu courier: ₹80 per kg slab (${shippingWeightSlab} kg)`
                  : `Other state courier: ₹120 per kg slab (${shippingWeightSlab} kg)`}
              </p>
            )}

          {finalAfterCoupon >= 999 && (
            <p className="text-sm text-green-700 font-semibold">
              Free shipping on orders ₹999 and above
            </p>
          )}
        </div>

        {/* GRAND TOTAL */}

        <div className="border-t mt-5 pt-5 flex justify-between items-center">
          <h2 className="text-3xl font-bold">
            Grand Total
          </h2>

          <h2 className="text-3xl font-bold text-[#31572C]">
            ₹{grandTotal.toFixed(2)}
          </h2>
        </div>

        {/* PAYMENT BUTTON */}

        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          className={`w-full mt-6 text-white py-4 rounded-2xl text-lg font-bold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#31572C] hover:bg-[#264653]"
          }`}
        >
          {loading
            ? "Processing..."
            : "Proceed to Pay"}
        </button>
      </div>
    </section>
  );
}