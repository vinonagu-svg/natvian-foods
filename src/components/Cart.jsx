import { useState } from "react";
import jsPDF from "jspdf";

// ✅ UPI QR IMAGE
import upiQR from "../assets/upi-qr.png";

export default function Cart({
  cart,
  setCart,
  removeFromCart
}) {

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
  // 🧾 GST DETAILS
  // =========================
  const GST_RATE = 0.05;

  const GST_NUMBER =
    "33ATHPN4463C1ZW";

  const HSN_CODE =
    "11061090";

  // =========================
  // 🚚 SHIPPING STATE
  // =========================
  const [state, setState] =
    useState("Tamil Nadu");

  // =========================
  // 🎟️ COUPON
  // =========================
  const [coupon, setCoupon] =
    useState("");

  const [couponDiscount, setCouponDiscount] =
    useState(0);

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
  // ➕ INCREASE QTY
  // =========================
  const increaseQty = (index) => {

    const updated = [...cart];

    updated[index].qty += 1;

    setCart(updated);
  };

  // =========================
  // ➖ DECREASE QTY
  // =========================
  const decreaseQty = (index) => {

    const updated = [...cart];

    if (updated[index].qty > 1) {

      updated[index].qty -= 1;

      setCart(updated);
    }
  };

  // =========================
  // 💰 MRP TOTAL
  // =========================
  const mrpTotal = cart.reduce(
    (sum, item) => {

      return (
        sum +
        Number(item.mrp) *
        Number(item.qty)
      );

    },
    0
  );

  // =========================
  // 💰 OFFER TOTAL
  // =========================
  const offerTotal = cart.reduce(
    (sum, item) => {

      const offerPrice =
        getOfferPrice(item.mrp);

      return (
        sum +
        offerPrice *
        Number(item.qty)
      );

    },
    0
  );

  // =========================
  // 🎉 PRODUCT DISCOUNT
  // =========================
  const productDiscount =
    mrpTotal - offerTotal;

  // =========================
  // 🎟️ APPLY COUPON
  // =========================
  const applyCoupon = () => {

    if (coupon === "SAVE10") {

      setCouponDiscount(
        offerTotal * 0.1
      );

    } else if (
      coupon === "FESTIVE20"
    ) {

      setCouponDiscount(
        offerTotal * 0.2
      );

    } else {

      setCouponDiscount(0);

      alert("Invalid Coupon");
    }
  };

  // =========================
  // 💰 FINAL AFTER COUPON
  // =========================
  const finalAfterCoupon =
    offerTotal - couponDiscount;

  // =========================
  // 🧾 GST INCLUDED
  // =========================
  const gstAmount =
    finalAfterCoupon -
    finalAfterCoupon / (1 + GST_RATE);

  // =========================
  // 🚚 SHIPPING
  // =========================
  const shippingCharge =
    finalAfterCoupon >= 999
      ? 0
      : state === "Tamil Nadu"
      ? 60
      : 100;

  // =========================
  // 💰 GRAND TOTAL
  // =========================
  const grandTotal =
    finalAfterCoupon +
    shippingCharge;

  // =========================
  // 📲 WHATSAPP MESSAGE
  // =========================
  const whatsappMessage = `

🧾 NATVIAN FOODS ORDER

${cart
  .map(
    (item) =>

      `• ${item.name}
(${item.weight})
Qty: ${item.qty}`
  )
  .join("\n")}

----------------------------

MRP Total:
₹${mrpTotal.toFixed(2)}

${OFFER_CONFIG.name}:
-₹${productDiscount.toFixed(2)}

Coupon Discount:
-₹${couponDiscount.toFixed(2)}

GST Included:
₹${gstAmount.toFixed(2)}

Shipping:
₹${shippingCharge}

TOTAL:
₹${grandTotal.toFixed(2)}

GST No:
${GST_NUMBER}

HSN:
${HSN_CODE}
`;

  // =========================
  // 📄 DOWNLOAD PDF
  // =========================
  const downloadInvoice = () => {

    const doc = new jsPDF();

    // TITLE
    doc.setFontSize(20);

    doc.text(
      "NATVIAN FOODS",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      "GST Invoice",
      20,
      30
    );

    // GST
    doc.text(
      `GST No: ${GST_NUMBER}`,
      20,
      40
    );

    doc.text(
      `HSN: ${HSN_CODE}`,
      20,
      48
    );

    // INVOICE NUMBER
    const invoiceNumber =
      "INV-" +
      Math.floor(
        Math.random() * 100000
      );

    doc.text(
      `Invoice: ${invoiceNumber}`,
      20,
      56
    );

    let y = 75;

    // TABLE HEADER
    doc.text("Item", 20, y);
    doc.text("Qty", 110, y);
    doc.text("Price", 140, y);
    doc.text("Total", 170, y);

    y += 10;

    // ITEMS
    cart.forEach((item) => {

      const offerPrice =
        getOfferPrice(item.mrp);

      const total =
        offerPrice * item.qty;

      doc.text(
        `${item.name}
(${item.weight})`,
        20,
        y
      );

      doc.text(
        String(item.qty),
        110,
        y
      );

      doc.text(
        `₹${offerPrice.toFixed(0)}`,
        140,
        y
      );

      doc.text(
        `₹${total.toFixed(0)}`,
        170,
        y
      );

      y += 12;
    });

    y += 10;

    // TOTALS
    doc.text(
      `MRP Total:
₹${mrpTotal.toFixed(2)}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `${OFFER_CONFIG.name}:
-₹${productDiscount.toFixed(2)}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Coupon:
-₹${couponDiscount.toFixed(2)}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `GST:
₹${gstAmount.toFixed(2)}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Shipping:
₹${shippingCharge}`,
      20,
      y
    );

    y += 15;

    doc.setFontSize(16);

    doc.text(
      `TOTAL:
₹${grandTotal.toFixed(2)}`,
      20,
      y
    );

    doc.save(
      `${invoiceNumber}.pdf`
    );
  };

  return (

    <div className="bg-white p-8 rounded-3xl shadow-xl">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8">

        Shopping Cart

      </h1>

      {/* EMPTY */}
      {cart.length === 0 ? (

        <p className="text-gray-500">
          Your cart is empty
        </p>

      ) : (

        <>

          {/* OFFER */}
          <div className="bg-green-100 text-green-700 p-4 rounded-2xl mb-6">

            <p className="font-bold">
              🎉 {OFFER_CONFIG.name}
            </p>

            <p>
              {OFFER_CONFIG.value}% OFF
              on all products
            </p>

          </div>

          {/* SHIPPING STATE */}
          <select
            value={state}
            onChange={(e) =>
              setState(
                e.target.value
              )
            }
            className="border p-3 rounded-xl w-full mb-6"
          >

            <option value="Tamil Nadu">
              Tamil Nadu
            </option>

            <option value="Other">
              Other States
            </option>

          </select>

          {/* COUPON */}
          <div className="flex gap-3 mb-8">

            <input
              type="text"
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) =>
                setCoupon(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl flex-1"
            />

            <button
              onClick={applyCoupon}
              className="bg-black text-white px-6 rounded-xl"
            >
              Apply
            </button>

          </div>

          {/* CART ITEMS */}
          <div className="space-y-5">

            {cart.map(
              (item, index) => {

                const offerPrice =
                  getOfferPrice(
                    item.mrp
                  );

                return (

                  <div
                    key={index}
                    className="border rounded-2xl p-5"
                  >

                    <div className="flex gap-5">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-cover"
                      />

                      <div className="flex-1">

                        <h2 className="font-bold text-xl">
                          {item.name}
                        </h2>

                        <p className="text-gray-500">
                          {item.weight}
                        </p>

                        <p className="text-gray-400 line-through">
                          ₹{item.mrp}
                        </p>

                        <p className="text-2xl font-bold text-green-700">
                          ₹
                          {offerPrice.toFixed(
                            0
                          )}
                        </p>

                        {/* QTY */}
                        <div className="flex items-center gap-3 mt-4">

                          <button
                            onClick={() =>
                              decreaseQty(
                                index
                              )
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
                              increaseQty(
                                index
                              )
                            }
                            className="bg-gray-200 px-3 py-1 rounded"
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeFromCart(
                            index
                          )
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* TOTALS */}
          <div className="border-t mt-8 pt-6 space-y-3">

            <p>
              MRP Total:
              ₹{mrpTotal.toFixed(2)}
            </p>

            <p className="text-green-600">
              {OFFER_CONFIG.name}:
              -₹
              {productDiscount.toFixed(
                2
              )}
            </p>

            <p>
              Coupon Discount:
              -₹
              {couponDiscount.toFixed(
                2
              )}
            </p>

            <p>
              GST Included:
              ₹{gstAmount.toFixed(2)}
            </p>

            <p>
              Shipping:
              ₹{shippingCharge}
            </p>

            <h2 className="text-3xl font-bold mt-4">

              Total:
              ₹{grandTotal.toFixed(2)}

            </h2>

            {shippingCharge === 0 && (

              <p className="text-green-600 font-medium">

                🎉 Free Shipping Applied

              </p>

            )}

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-4 mt-8">

            {/* PDF */}
            <button
              onClick={downloadInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold"
            >
              Download Invoice
            </button>

            {/* WHATSAPP */}
            <a
              href={`https://wa.me/917411498799?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-center font-bold"
            >
              Order on WhatsApp
            </a>

            {/* UPI BUTTON */}
            <a
              href={`upi://pay?pa=YOURUPI@okaxis&pn=NatvianFoods&am=${grandTotal}&cu=INR`}
              className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl text-center font-bold"
            >

              Pay via UPI App

            </a>

          </div>

          {/* QR CODE */}
          <div className="mt-10 border rounded-3xl p-8 text-center">

            <h2 className="text-2xl font-bold mb-5">

              Scan & Pay

            </h2>

            <img
              src={upiQR}
              alt="UPI QR"
              className="w-64 mx-auto rounded-2xl shadow-lg"
            />

            <p className="mt-5 text-gray-600">

              Scan using Google Pay,
              PhonePe, Paytm or any UPI App

            </p>

            <h3 className="text-4xl font-bold text-green-700 mt-6">

              ₹{grandTotal.toFixed(2)}

            </h3>

          </div>

        </>
      )}

    </div>
  );
}