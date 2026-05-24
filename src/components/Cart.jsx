import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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
    pincode: "",
  });

  // =========================
  // STATE
  // =========================
  const [state, setState] =
    useState("Tamil Nadu");

  // =========================
  // COUPON
  // =========================
  const [coupon, setCoupon] =
    useState("");

  const [couponDiscount, setCouponDiscount] =
    useState(0);

  // =========================
  // OFFER
  // =========================
  const OFFER = 10;

  const getOfferPrice = (mrp) => {
    const price = Number(mrp) || 0;

    return (
      price -
      (price * OFFER) / 100
    );
  };

  // =========================
  // APPLY COUPON
  // =========================
  const applyCoupon = () => {

    if (
      coupon.trim().toUpperCase() ===
      "SAVE10"
    ) {

      setCouponDiscount(
        offerTotal * 0.1
      );

      alert("Coupon Applied ✅");

    } else {

      setCouponDiscount(0);

      alert("Invalid Coupon ❌");
    }
  };

  // =========================
  // QTY
  // =========================
  const increaseQty = (i) => {

    const updated = [...cart];

    updated[i].qty += 1;

    setCart(updated);
  };

  const decreaseQty = (i) => {

    const updated = [...cart];

    if (updated[i].qty > 1) {
      updated[i].qty -= 1;
    }

    setCart(updated);
  };

  // =========================
  // TOTALS
  // =========================
  const mrpTotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.mrp) *
      Number(item.qty),
    0
  );

  const offerTotal = cart.reduce(
    (sum, item) =>
      sum +
      getOfferPrice(item.mrp) *
      item.qty,
    0
  );

  const finalAfterCoupon =
    offerTotal - couponDiscount;

  // =========================
  // GST
  // =========================
  const GST = 0.05;

  const totalGST =
    finalAfterCoupon -
    finalAfterCoupon / (1 + GST);

  const cgst = totalGST / 2;
  const sgst = totalGST / 2;

  // =========================
  // SHIPPING
  // =========================
  const totalQty = cart.reduce(
    (sum, item) =>
      sum + item.qty,
    0
  );

  const shipping =
    state === "Tamil Nadu"
      ? totalQty * 60
      : totalQty * 100;

  // =========================
  // GRAND TOTAL
  // =========================
  const grandTotal =
    finalAfterCoupon + shipping;

  // =========================
  // DOWNLOAD INVOICE
  // =========================
  const downloadInvoice =
    async () => {

    const { default: jsPDF } =
      await import("jspdf");

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "NATVIAN FOODS",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Customer: ${customer.name}`,
      20,
      40
    );

    doc.text(
      `Phone: ${customer.phone}`,
      20,
      50
    );

    doc.text(
      `Address: ${customer.address}`,
      20,
      60
    );

    doc.text(
      `Pincode: ${customer.pincode}`,
      20,
      70
    );

    doc.text(
      `State: ${state}`,
      20,
      80
    );

    let y = 100;

    cart.forEach((item) => {

      doc.text(
        `${item.name} (${item.weight}) x ${item.qty} = ₹${(
          getOfferPrice(item.mrp) *
          item.qty
        ).toFixed(2)}`,
        20,
        y
      );

      y += 10;
    });

    y += 10;

    doc.text(
      `Grand Total: ₹${grandTotal.toFixed(2)}`,
      20,
      y
    );

    doc.save(
      `Invoice-${Date.now()}.pdf`
    );
  };

  // =========================
  // PAYMENT
  // =========================
  const handlePayment =
    async () => {

    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.pincode
    ) {

      alert(
        "Please fill all customer details"
      );

      return;
    }

    if (cart.length === 0) {

      alert("Cart is empty");

      return;
    }

    try {

      // CREATE ORDER
      const response =
        await fetch(
          "/api/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount:
                Math.round(
                  grandTotal * 100
                ),

              currency: "INR",

              receipt:
                "receipt_" +
                Date.now(),
            }),
          }
        );

      const order =
        await response.json();

      if (!order.id) {

        alert(
          "Order creation failed"
        );

        return;
      }

      // RAZORPAY OPTIONS
      const options = {

        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          order.amount,

        currency:
          order.currency,

        order_id:
          order.id,

        name:
          "Natvian Foods",

        description:
          "Healthy Food Order",

        image:
          "/Logo.webp",

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

            // VERIFY PAYMENT
            const verifyResponse =
              await fetch(
                "/api/verify-payment",
                {
                  method:
                    "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body:
                    JSON.stringify(
                      response
                    ),
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (
              !verifyData.success
            ) {

              alert(
                "Payment Verification Failed ❌"
              );

              return;
            }

            // SAVE ORDER
            await addDoc(
              collection(
                db,
                "orders"
              ),
              {
                orderId:
                  "ORD-" +
                  Date.now(),

                customerName:
                  customer.name,

                phoneNumber:
                  customer.phone,

                address:
                  customer.address,

                pincode:
                  customer.pincode,

                state,

                products:
                  cart,

                totalQuantity:
                  totalQty,

                mrpTotal,

                offerTotal,

                couponDiscount,

                shipping,

                cgst,

                sgst,

                grandTotal,

                paymentStatus:
                  "Paid",

                paymentId:
                  response.razorpay_payment_id,

                createdAt:
                  new Date().toISOString(),
              }
            );

            alert(
              "🎉 Order Placed Successfully!"
            );

            await downloadInvoice();

            setCart([]);

          } catch (error) {

            console.error(error);

            alert(
              "Order save failed"
            );
          }
        },
      };

      const rzp =
        new window.Razorpay(
          options
        );

      rzp.open();

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong"
      );
    }
  };

  // =========================
  // UI
  // =========================
  return (

    <section
      className="max-w-5xl mx-auto p-6"
    >

      <h1 className="text-3xl font-bold mb-8 text-[#31572C]">
        Shopping Cart
      </h1>

      {cart.length === 0 && (

        <div className="border p-10 text-center bg-white rounded-2xl">
          <h2>
            Your Cart is Empty 🛒
          </h2>
        </div>
      )}

      {/* CART ITEMS */}
      <div className="space-y-4">

        {cart.map((item, i) => (

          <div
            key={i}
            className="border rounded-2xl p-4 flex justify-between items-center bg-white"
          >

            <div>

              <h3 className="font-bold text-lg">
                {item.name}
              </h3>

              <p>
                {item.weight}
              </p>

              <p className="line-through text-gray-400">
                ₹{item.mrp}
              </p>

              <p className="text-green-600 font-bold">
                ₹
                {getOfferPrice(
                  item.mrp
                ).toFixed(2)}
              </p>

            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  decreaseQty(i)
                }
                className="bg-gray-200 px-3 py-1 rounded"
              >
                -
              </button>

              <span>
                {item.qty}
              </span>

              <button
                onClick={() =>
                  increaseQty(i)
                }
                className="bg-gray-200 px-3 py-1 rounded"
              >
                +
              </button>

              <button
                onClick={() =>
                  removeFromCart(i)
                }
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>

            </div>

          </div>
        ))}
      </div>

      {/* CUSTOMER DETAILS */}
      <div className="mt-10 grid gap-4">

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

        <input
          type="text"
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

        <textarea
          placeholder="Full Address"
          className="border p-3 rounded-xl"
          value={customer.address}
          onChange={(e) =>
            setCustomer({
              ...customer,
              address:
                e.target.value,
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

        <select
          className="border p-3 rounded-xl"
          value={state}
          onChange={(e) =>
            setState(
              e.target.value
            )
          }
        >

          <option>
            Tamil Nadu
          </option>

          <option>
            Karnataka
          </option>

          <option>
            Kerala
          </option>

          <option>
            Andhra Pradesh
          </option>

        </select>

      </div>

      {/* COUPON */}
      <div className="mt-8 flex gap-3">

        <input
          type="text"
          placeholder="Coupon Code"
          className="border p-3 rounded-xl flex-1"
          value={coupon}
          onChange={(e) =>
            setCoupon(
              e.target.value
            )
          }
        />

        <button
          onClick={applyCoupon}
          className="bg-black text-white px-6 rounded-xl"
        >
          Apply
        </button>

      </div>

      {/* TOTAL */}
      <div className="mt-10 border rounded-2xl p-6 bg-white">

        <div className="flex justify-between mb-2">
          <span>
            Offer Total
          </span>

          <span>
            ₹{offerTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span>
            Shipping
          </span>

          <span>
            ₹{shipping.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span>
            Discount
          </span>

          <span>
            -₹{couponDiscount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-2xl font-bold mt-4">
          <span>
            Grand Total
          </span>

          <span>
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>

      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex gap-4">

        <button
          onClick={
            handlePayment
          }
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold"
        >
          Pay & Place Order
        </button>

        <button
          onClick={
            downloadInvoice
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold"
        >
          Download Invoice
        </button>

      </div>

    </section>
  );
}