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

  // =========================
  // STATE
  // =========================
  const [state, setState] =
    useState("Tamil Nadu");

  // =========================
  // COUPON STATE
  // =========================
  const [coupon, setCoupon] =
    useState("");

  const [couponDiscount, setCouponDiscount] =
    useState(0);

  const [appliedCoupon, setAppliedCoupon] =
    useState(null);

  const [availableCoupons, setAvailableCoupons] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // FETCH ACTIVE COUPONS
  // =========================
  useEffect(() => {

    const fetchCoupons = async () => {

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
  // PRODUCT PRICE
  // GST IS ALREADY INCLUDED
  // =========================
  const getPrice = (mrp) => {
    return Number(mrp) || 0;
  };

  // =========================
  // CART TOTAL
  // =========================
  const mrpTotal = cart.reduce(
    (sum, item) =>
      sum +
      getPrice(item.mrp) *
      Number(item.qty || 1),
    0
  );

  // No automatic product discount
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

    const code =
      coupon.trim().toUpperCase();

    const found =
      availableCoupons.find(
        (c) =>
          c.code?.toUpperCase() ===
          code
      );

    // INVALID COUPON
    if (!found) {

      setCouponDiscount(0);
      setAppliedCoupon(null);

      alert(
        "Invalid Coupon ❌"
      );

      return;
    }

    // =========================
    // CHECK EXPIRY
    // =========================

    let expiryDate;

    if (found.expiryDate?.seconds) {

      expiryDate =
        new Date(
          found.expiryDate.seconds *
          1000
        );

    } else {

      expiryDate =
        new Date(
          found.expiryDate
        );
    }

    if (
      expiryDate &&
      !isNaN(expiryDate) &&
      expiryDate < new Date()
    ) {

      setCouponDiscount(0);
      setAppliedCoupon(null);

      alert(
        "Coupon Expired ⛔"
      );

      return;
    }

    // =========================
    // MINIMUM CART VALUE
    // =========================

    const minCart =
      Number(
        found.minCartValue || 0
      );

    if (
      offerTotal < minCart
    ) {

      setCouponDiscount(0);
      setAppliedCoupon(null);

      alert(
        `Minimum cart value ₹${minCart} required`
      );

      return;
    }

    // =========================
    // CALCULATE DISCOUNT
    // =========================

    let discount = 0;

    if (
      found.type === "PERCENT"
    ) {

      discount =
        (
          offerTotal *
          Number(found.value || 0)
        ) / 100;

    } else {

      discount =
        Number(
          found.value || 0
        );
    }

    // Prevent negative total
    if (
      discount > offerTotal
    ) {

      discount =
        offerTotal;
    }

    setCouponDiscount(
      discount
    );

    setAppliedCoupon(
      found.code
    );

    alert(
      "Coupon Applied ✅"
    );
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
  // FINAL PRODUCT TOTAL
  // GST INCLUDED
  // =========================
  const finalAfterCoupon =
    Math.max(
      offerTotal -
      couponDiscount,
      0
    );

  // =========================
  // GST
  // GST IS INCLUDED IN PRICE
  // =========================

  const GST_PERCENT = 5;

  /*
    Example:

    Product price = ₹199

    GST included:

    ₹199 × 5 / 105
    = ₹9.48 GST

    CGST = ₹4.74
    SGST = ₹4.74

    Taxable value = ₹189.52
  */

  const totalGST =
    finalAfterCoupon *
    (
      GST_PERCENT /
      (100 + GST_PERCENT)
    );

  const cgst =
    totalGST / 2;

  const sgst =
    totalGST / 2;

  const taxableAmount =
    finalAfterCoupon -
    totalGST;

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

  // =========================
  // GRAND TOTAL
  // =========================

  const grandTotal =
    finalAfterCoupon +
    shipping;

  // =========================
  // QUANTITY CONTROL
  // =========================

  const increaseQty = (i) => {

    const updated =
      [...cart];

    updated[i].qty =
      Number(
        updated[i].qty || 1
      ) + 1;

    setCart(updated);
  };

  const decreaseQty = (i) => {

    const updated =
      [...cart];

    if (
      Number(
        updated[i].qty || 1
      ) > 1
    ) {

      updated[i].qty -= 1;
    }

    setCart(updated);
  };

  // =========================
  // RAZORPAY PAYMENT
  // =========================

  const handlePayment =
    async () => {

      try {

        // =========================
        // VALIDATION
        // =========================

        if (
          !customer.name.trim()
        ) {

          alert(
            "Please enter your name"
          );

          return;
        }

        if (
          !customer.phone.trim()
        ) {

          alert(
            "Please enter your phone number"
          );

          return;
        }

        if (
          !customer.address.trim()
        ) {

          alert(
            "Please enter your address"
          );

          return;
        }

        if (
          !customer.city.trim()
        ) {

          alert(
            "Please enter your city"
          );

          return;
        }

        if (
          !customer.pincode.trim()
        ) {

          alert(
            "Please enter your pincode"
          );

          return;
        }

        if (!state) {

          alert(
            "Please select your state"
          );

          return;
        }

        if (!window.Razorpay) {

          alert(
            "Razorpay SDK not loaded"
          );

          return;
        }

        setLoading(true);

        // =========================
        // RAZORPAY OPTIONS
        // =========================

        const options = {

          key:
            import.meta.env
              .VITE_RAZORPAY_KEY_ID,

          // Amount in paise
          amount:
            Math.round(
              grandTotal * 100
            ),

          currency: "INR",

          name:
            "Natvian Foods",

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

            city:
              customer.city,

            state:
              state,

            pincode:
              customer.pincode,

            coupon:
              appliedCoupon || "",
          },

          theme: {

            color:
              "#31572C",
          },

          // =========================
          // PAYMENT SUCCESS
          // =========================

          handler:
            async function (
              response
            ) {

              try {

                const orderNumber =
                  "NF-" +
                  Date.now();

                console.log(
                  "Customer",
                  customer
                );

                console.log(
                  "State",
                  state
                );

                console.log(
                  "Cart",
                  cart
                );

                console.log(
                  "Applied Coupon",
                  appliedCoupon
                );

                console.log(
                  "Payment Response",
                  response
                );

                // =========================
                // SAVE ORDER
                // =========================

                await addDoc(
                  collection(
                    db,
                    "orders"
                  ),
                  {

                    // =========================
                    // ORDER NUMBER
                    // =========================

                    orderNumber:
                      orderNumber,

                    // =========================
                    // CUSTOMER
                    // =========================

                    customer: {

                      name:
                        customer.name ||
                        "",

                      phone:
                        customer.phone ||
                        "",

                      address:
                        customer.address ||
                        "",

                      city:
                        customer.city ||
                        "",

                      state:
                        state ||
                        "",

                      pincode:
                        customer.pincode ||
                        "",
                    },

                    // =========================
                    // ITEMS
                    // =========================

                    items:
                      cart.map(
                        (item) => ({

                          id:
                            item.id ||
                            "",

                          name:
                            item.name ||
                            "",

                          weight:
                            item.weight ||
                            "",

                          mrp:
                            Number(
                              item.mrp ||
                              0
                            ),

                          qty:
                            Number(
                              item.qty ||
                              1
                            ),
                        })
                      ),

                    // =========================
                    // PRICE DETAILS
                    // =========================

                    subtotal:
                      Number(
                        mrpTotal
                      ) || 0,

                    couponDiscount:
                      Number(
                        couponDiscount
                      ) || 0,

                    taxableAmount:
                      Number(
                        taxableAmount
                      ) || 0,

                    totalGST:
                      Number(
                        totalGST
                      ) || 0,

                    cgst:
                      Number(
                        cgst
                      ) || 0,

                    sgst:
                      Number(
                        sgst
                      ) || 0,

                    shipping:
                      Number(
                        shipping
                      ) || 0,

                    grandTotal:
                      Number(
                        grandTotal
                      ) || 0,

                    // =========================
                    // COUPON
                    // =========================

                    coupon:
                      appliedCoupon ||
                      "",

                    // =========================
                    // PAYMENT
                    // =========================

                    paymentId:
                      response
                        ?.razorpay_payment_id ||
                      "",

                    paymentStatus:
                      "PAID",

                    orderStatus:
                      "pending",

                    // =========================
                    // GST
                    // =========================

                    gstIncluded:
                      true,

                    gstRate:
                      GST_PERCENT,

                    // =========================
                    // TIMESTAMP
                    // =========================

                    createdAt:
                      serverTimestamp(),
                  }
                );

                alert(
                  "Payment Successful ✅"
                );

                setCart([]);

              } catch (error) {

                console.error(
                  "FULL ERROR:",
                  error
                );

                console.error(
                  "ERROR CODE:",
                  error.code
                );

                console.error(
                  "ERROR MESSAGE:",
                  error.message
                );

                alert(
                  `Order save failed:
${error.code || ""}
${error.message || ""}`
                );

              } finally {

                setLoading(false);
              }
            },
        };

        // =========================
        // CREATE RAZORPAY
        // =========================

        const razorpay =
          new window.Razorpay(
            options
          );

        // =========================
        // PAYMENT FAILED
        // =========================

        razorpay.on(
          "payment.failed",
          function (
            response
          ) {

            console.error(
              response
            );

            setLoading(false);

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

        setLoading(false);

        alert(
          "Unable to start payment"
        );
      }
    };

  // =========================
  // EMPTY CART
  // =========================

  if (
    cart.length === 0
  ) {

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
  // MAIN UI
  // =========================

  return (

    <section className="max-w-5xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8 text-[#31572C]">
        Shopping Cart
      </h1>

      {/* =========================
          CART ITEMS
      ========================= */}

      <div className="space-y-4">

        {cart.map(
          (item, i) => (

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
          )
        )}

      </div>

      {/* =========================
          CUSTOMER DETAILS
      ========================= */}

      <div className="mt-10 bg-white p-6 rounded-3xl shadow">

        <h2 className="text-2xl font-bold mb-5">
          Customer Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {/* NAME */}

          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded-xl"
            value={customer.name}
            onChange={(e) =>
              setCustomer({
                ...customer,
                name:
                  e.target.value,
              })
            }
          />

          {/* PHONE */}

          <input
            type="tel"
            placeholder="Phone Number"
            className="border p-3 rounded-xl"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone:
                  e.target.value,
              })
            }
          />

          {/* CITY */}

          <input
            type="text"
            placeholder="City"
            className="border p-3 rounded-xl"
            value={customer.city}
            onChange={(e) =>
              setCustomer({
                ...customer,
                city:
                  e.target.value,
              })
            }
          />

          {/* STATE */}

          <select
            className="border p-3 rounded-xl"
            value={state}
            onChange={(e) =>
              setState(
                e.target.value
              )
            }
          >

            <option value="">
              Select State
            </option>

            <option value="Andhra Pradesh">
              Andhra Pradesh
            </option>

            <option value="Arunachal Pradesh">
              Arunachal Pradesh
            </option>

            <option value="Assam">
              Assam
            </option>

            <option value="Bihar">
              Bihar
            </option>

            <option value="Chhattisgarh">
              Chhattisgarh
            </option>

            <option value="Goa">
              Goa
            </option>

            <option value="Gujarat">
              Gujarat
            </option>

            <option value="Haryana">
              Haryana
            </option>

            <option value="Himachal Pradesh">
              Himachal Pradesh
            </option>

            <option value="Jharkhand">
              Jharkhand
            </option>

            <option value="Karnataka">
              Karnataka
            </option>

            <option value="Kerala">
              Kerala
            </option>

            <option value="Madhya Pradesh">
              Madhya Pradesh
            </option>

            <option value="Maharashtra">
              Maharashtra
            </option>

            <option value="Manipur">
              Manipur
            </option>

            <option value="Meghalaya">
              Meghalaya
            </option>

            <option value="Mizoram">
              Mizoram
            </option>

            <option value="Nagaland">
              Nagaland
            </option>

            <option value="Odisha">
              Odisha
            </option>

            <option value="Punjab">
              Punjab
            </option>

            <option value="Rajasthan">
              Rajasthan
            </option>

            <option value="Sikkim">
              Sikkim
            </option>

            <option value="Tamil Nadu">
              Tamil Nadu
            </option>

            <option value="Telangana">
              Telangana
            </option>

            <option value="Tripura">
              Tripura
            </option>

            <option value="Uttar Pradesh">
              Uttar Pradesh
            </option>

            <option value="Uttarakhand">
              Uttarakhand
            </option>

            <option value="West Bengal">
              West Bengal
            </option>

            <option value="Delhi">
              Delhi
            </option>

            <option value="Jammu and Kashmir">
              Jammu and Kashmir
            </option>

            <option value="Ladakh">
              Ladakh
            </option>

            <option value="Puducherry">
              Puducherry
            </option>

            <option value="Chandigarh">
              Chandigarh
            </option>

          </select>

          {/* PINCODE */}

          <input
            type="text"
            placeholder="Pincode"
            maxLength={6}
            className="border p-3 rounded-xl"
            value={
              customer.pincode
            }
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

          {/* ADDRESS */}

          <textarea
            placeholder="Address"
            className="border p-3 rounded-xl md:col-span-2"
            rows={4}
            value={
              customer.address
            }
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

      {/* =========================
          COUPON
      ========================= */}

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
            onClick={
              applyCoupon
            }
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

      {/* =========================
          ORDER SUMMARY
      ========================= */}

      <div className="mt-10 bg-white p-6 rounded-3xl shadow">

        <h2 className="text-2xl font-bold mb-5">
          Order Summary
        </h2>

        <div className="space-y-2 text-lg">

          {/* SUBTOTAL */}

          <div className="flex justify-between">

            <span>
              Subtotal (GST Included)
            </span>

            <span>
              ₹
              {mrpTotal.toFixed(2)}
            </span>

          </div>

          {/* COUPON */}

          <div className="flex justify-between text-red-500">

            <span>
              Coupon Discount
            </span>

            <span>
              -₹
              {couponDiscount.toFixed(2)}
            </span>

          </div>

          {/* CGST */}

          <div className="flex justify-between text-gray-600">

            <span>
              CGST (Included)
            </span>

            <span>
              ₹
              {cgst.toFixed(2)}
            </span>

          </div>

          {/* SGST */}

          <div className="flex justify-between text-gray-600">

            <span>
              SGST (Included)
            </span>

            <span>
              ₹
              {sgst.toFixed(2)}
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

          {/* GST NOTE */}

          <p className="text-sm text-gray-500 pt-2">
            GST is already included in the product price.
          </p>

          {/* SHIPPING NOTE */}

          {finalAfterCoupon < 999 && (

            <p className="text-sm text-gray-500">

              {state === "Tamil Nadu"
                ? "Tamil Nadu shipping: ₹60"
                : "Other state shipping: ₹100"}

            </p>

          )}

          {finalAfterCoupon >= 999 && (

            <p className="text-sm text-green-700 font-semibold">

              🎉 Free shipping on orders ₹999 and above

            </p>

          )}

        </div>

        {/* =========================
            GRAND TOTAL
        ========================= */}

        <div className="border-t mt-5 pt-5 flex justify-between items-center">

          <h2 className="text-3xl font-bold">
            Grand Total
          </h2>

          <h2 className="text-3xl font-bold text-[#31572C]">

            ₹
            {grandTotal.toFixed(2)}

          </h2>

        </div>

        {/* =========================
            PAYMENT BUTTON
        ========================= */}

        <button
          onClick={
            handlePayment
          }
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