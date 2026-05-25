import { useState } from "react";
import { db } from "../firebase";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Cart({
  cart,
  setCart,
  removeFromCart,
}) {
  // =========================
  // COMPANY
  // =========================
  const COMPANY = {
    name: "Natvian Foods",

    address:
      "3/147A, Chettiyar Thottam, Periyathiottampudur, Karamadai Block, Coimbatore, Tamil Nadu - 638459",

    gstin:
      "33ATHPN4463C1ZW",

    fssai:
      "22426402000209",

    pan:
      "ATHPN4463C",

    phone:
      "+91 9788857645",

    website:
      "https://www.thenativefood.com",
  };

  // =========================
  // CUSTOMER
  // =========================
  const [customer, setCustomer] =
    useState({
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
  // COUPON
  // =========================
  const [coupon, setCoupon] =
    useState("");

  const [
    couponDiscount,
    setCouponDiscount,
  ] = useState(0);

  // =========================
  // LOADING
  // =========================
  const [loading, setLoading] =
    useState(false);

  // =========================
  // OFFER
  // =========================
  const OFFER_PERCENT = 10;

  const getOfferPrice = (
    mrp
  ) => {
    const price =
      Number(mrp) || 0;

    return (
      price -
      (price *
        OFFER_PERCENT) /
        100
    );
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
      getOfferPrice(
        item.mrp
      ) *
        item.qty,
    0
  );

  const finalAfterCoupon =
    offerTotal -
    couponDiscount;

  // =========================
  // GST
  // =========================
  const GST = 0.05;

  const totalGST =
    finalAfterCoupon -
    finalAfterCoupon /
      (1 + GST);

  const cgst =
    totalGST / 2;

  const sgst =
    totalGST / 2;

  // =========================
  // SHIPPING
  // =========================
  const totalQty = cart.reduce(
    (sum, item) =>
      sum + item.qty,
    0
  );

  const shipping =
    state ===
    "Tamil Nadu"
      ? totalQty * 60
      : totalQty * 100;

  // =========================
  // GRAND TOTAL
  // =========================
  const grandTotal =
    finalAfterCoupon +
    shipping;

  // =========================
  // APPLY COUPON
  // =========================
  const applyCoupon = () => {
    if (
      coupon
        .trim()
        .toUpperCase() ===
      "SAVE10"
    ) {
      const discount =
        offerTotal * 0.1;

      setCouponDiscount(
        discount
      );

      alert(
        "Coupon Applied ✅"
      );
    } else {
      setCouponDiscount(0);

      alert(
        "Invalid Coupon ❌"
      );
    }
  };

  // =========================
  // DOWNLOAD INVOICE
  // =========================
  const downloadInvoice =
    async (
      paymentId = "COD"
    ) => {
      try {
        const {
          default: jsPDF,
        } = await import(
          "jspdf"
        );

        const doc =
          new jsPDF();

        const invoiceNo =
          "INV-" +
          Date.now();

        // HEADER
        doc.setFillColor(
          49,
          87,
          44
        );

        doc.rect(
          0,
          0,
          220,
          35,
          "F"
        );

        doc.setTextColor(
          255,
          255,
          255
        );

        doc.setFontSize(24);

        doc.text(
          COMPANY.name,
          20,
          20
        );

        doc.setFontSize(11);

        doc.text(
          "TAX INVOICE",
          20,
          29
        );

        // COMPANY
        doc.setTextColor(
          0,
          0,
          0
        );

        doc.setFontSize(11);

        doc.text(
          COMPANY.address,
          20,
          48
        );

        doc.text(
          `GSTIN : ${COMPANY.gstin}`,
          20,
          58
        );

        doc.text(
          `FSSAI : ${COMPANY.fssai}`,
          20,
          66
        );

        doc.text(
          `PAN : ${COMPANY.pan}`,
          20,
          74
        );

        // INVOICE DETAILS
        doc.text(
          `Invoice No : ${invoiceNo}`,
          130,
          48
        );

        doc.text(
          `Date : ${new Date().toLocaleDateString()}`,
          130,
          58
        );

        doc.text(
          `Payment ID : ${paymentId}`,
          130,
          68
        );

        // CUSTOMER
        doc.setFillColor(
          240,
          240,
          240
        );

        doc.rect(
          20,
          92,
          170,
          45,
          "F"
        );

        doc.setFontSize(13);

        doc.text(
          "Bill To",
          25,
          102
        );

        doc.setFontSize(11);

        doc.text(
          `Name : ${customer.name}`,
          25,
          112
        );

        doc.text(
          `Phone : ${customer.phone}`,
          25,
          120
        );

        doc.text(
          `Address : ${customer.address}`,
          25,
          128
        );

        doc.text(
          `${customer.city} - ${customer.pincode}`,
          25,
          136
        );

        // TABLE
        let y = 155;

        doc.setFillColor(
          49,
          87,
          44
        );

        doc.rect(
          20,
          y,
          170,
          10,
          "F"
        );

        doc.setTextColor(
          255,
          255,
          255
        );

        doc.text(
          "Product",
          25,
          y + 7
        );

        doc.text(
          "Qty",
          120,
          y + 7
        );

        doc.text(
          "Amount",
          155,
          y + 7
        );

        y += 18;

        doc.setTextColor(
          0,
          0,
          0
        );

        cart.forEach(
          (item) => {
            doc.text(
              `${item.name} (${item.weight})`,
              25,
              y
            );

            doc.text(
              `${item.qty}`,
              122,
              y
            );

            doc.text(
              `₹${(
                getOfferPrice(
                  item.mrp
                ) * item.qty
              ).toFixed(2)}`,
              155,
              y
            );

            y += 10;
          }
        );

        y += 10;

        doc.line(
          20,
          y,
          190,
          y
        );

        y += 12;

        doc.text(
          `MRP Total : ₹${mrpTotal.toFixed(
            2
          )}`,
          120,
          y
        );

        y += 8;

        doc.text(
          `Coupon Discount : ₹${couponDiscount.toFixed(
            2
          )}`,
          120,
          y
        );

        y += 8;

        doc.text(
          `CGST : ₹${cgst.toFixed(
            2
          )}`,
          120,
          y
        );

        y += 8;

        doc.text(
          `SGST : ₹${sgst.toFixed(
            2
          )}`,
          120,
          y
        );

        y += 8;

        doc.text(
          `Shipping : ₹${shipping.toFixed(
            2
          )}`,
          120,
          y
        );

        y += 15;

        doc.setFontSize(16);

        doc.setTextColor(
          49,
          87,
          44
        );

        doc.text(
          `Grand Total : ₹${grandTotal.toFixed(
            2
          )}`,
          110,
          y
        );

        y += 25;

        doc.setFontSize(10);

        doc.setTextColor(
          100,
          100,
          100
        );

        doc.text(
          "Thank you for shopping with Natvian Foods",
          20,
          y
        );

        doc.save(
          `${invoiceNo}.pdf`
        );
      } catch (error) {
        console.error(
          "Invoice Error",
          error
        );
      }
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
        !customer.city ||
        !customer.pincode
      ) {
        alert(
          "Please fill all customer details"
        );

        return;
      }

      if (cart.length === 0) {
        alert(
          "Cart is empty"
        );

        return;
      }

      try {
        setLoading(true);

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

              body:
                JSON.stringify(
                  {
                    amount:
                      Math.round(
                        grandTotal *
                          100
                      ),

                    currency:
                      "INR",
                  }
                ),
            }
          );

        const order =
          await response.json();

        if (!order.id) {
          alert(
            "Order creation failed"
          );

          setLoading(false);

          return;
        }

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

          theme: {
            color:
              "#31572C",
          },

          prefill: {
            name:
              customer.name,

            contact:
              customer.phone,
          },

          handler:
            async function (
              response
            ) {
              try {
                // VERIFY
                const verifyResponse =
                  await fetch(
                    "/api/verify-payment",
                    {
                      method:
                        "POST",

                      headers:
                        {
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
                    "Payment verification failed"
                  );

                  setLoading(
                    false
                  );

                  return;
                }

                // SAVE FIREBASE
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

                    city:
                      customer.city,

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
                      serverTimestamp(),
                  }
                );

                // DOWNLOAD
                await downloadInvoice(
                  response.razorpay_payment_id
                );

                alert(
                  "🎉 Order Placed Successfully!"
                );

                // RESET
                setCart([]);

                setCoupon("");

                setCouponDiscount(
                  0
                );

                setCustomer({
                  name: "",
                  phone: "",
                  address:
                    "",
                  city: "",
                  pincode:
                    "",
                });

                setLoading(
                  false
                );
              } catch (error) {
                console.error(
                  error
                );

                setLoading(
                  false
                );

                alert(
                  "Order save failed"
                );
              }
            },

          modal: {
            ondismiss:
              function () {
                setLoading(
                  false
                );
              },
          },
        };

        const rzp =
          new window.Razorpay(
            options
          );

        rzp.open();
      } catch (error) {
        console.error(
          error
        );

        setLoading(false);

        alert(
          "Something went wrong"
        );
      }
    };

  // =========================
  // UI
  // =========================
  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-[#31572C]">
        Shopping Cart
      </h1>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {cart.map(
          (item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border p-5 flex flex-col md:flex-row justify-between gap-5"
            >
              <div className="flex gap-5">
                <img
                  src={
                    item.image
                  }
                  alt={
                    item.name
                  }
                  className="w-24 h-24 rounded-2xl object-cover border"
                />

                <div>
                  <h2 className="font-bold text-xl">
                    {item.name}
                  </h2>

                  <p>
                    {item.weight}
                  </p>

                  <p className="line-through text-gray-400">
                    ₹{item.mrp}
                  </p>

                  <p className="text-green-700 font-bold text-xl">
                    ₹
                    {getOfferPrice(
                      item.mrp
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    decreaseQty(i)
                  }
                  className="w-10 h-10 rounded-xl bg-gray-200"
                >
                  -
                </button>

                <span className="font-bold text-xl">
                  {item.qty}
                </span>

                <button
                  onClick={() =>
                    increaseQty(i)
                  }
                  className="w-10 h-10 rounded-xl bg-gray-200"
                >
                  +
                </button>

                <button
                  onClick={() =>
                    removeFromCart(i)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Remove
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* CUSTOMER */}
      <div className="bg-white rounded-3xl border p-6 mt-10">
        <h2 className="text-2xl font-bold mb-5">
          Customer Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={
              customer.name
            }
            onChange={(e) =>
              setCustomer({
                ...customer,
                name:
                  e.target
                    .value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={
              customer.phone
            }
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone:
                  e.target
                    .value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="City"
            value={
              customer.city
            }
            onChange={(e) =>
              setCustomer({
                ...customer,
                city:
                  e.target
                    .value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Pincode"
            value={
              customer.pincode
            }
            onChange={(e) =>
              setCustomer({
                ...customer,
                pincode:
                  e.target
                    .value,
              })
            }
            className="border p-4 rounded-xl"
          />

          <textarea
            placeholder="Full Address"
            value={
              customer.address
            }
            onChange={(e) =>
              setCustomer({
                ...customer,
                address:
                  e.target
                    .value,
              })
            }
            className="border p-4 rounded-xl md:col-span-2 min-h-[120px]"
          />

          <select
            value={state}
            onChange={(e) =>
              setState(
                e.target
                  .value
              )
            }
            className="border p-4 rounded-xl"
          >
            <option value="Tamil Nadu">
              Tamil Nadu
            </option>

            <option value="Other State">
              Other State
            </option>
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-white rounded-3xl border p-6 mt-10">
        <h2 className="text-2xl font-bold mb-5">
          Order Summary
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>
              Offer Total
            </span>

            <span>
              ₹
              {offerTotal.toFixed(
                2
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              Shipping
            </span>

            <span>
              ₹
              {shipping.toFixed(
                2
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              CGST
            </span>

            <span>
              ₹
              {cgst.toFixed(
                2
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              SGST
            </span>

            <span>
              ₹
              {sgst.toFixed(
                2
              )}
            </span>
          </div>

          <div className="flex justify-between text-3xl font-bold text-[#31572C] border-t pt-5 mt-5">
            <span>
              Grand Total
            </span>

            <span>
              ₹
              {grandTotal.toFixed(
                2
              )}
            </span>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={
            handlePayment
          }
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : "Pay & Place Order"}
        </button>

        <button
          onClick={() =>
            downloadInvoice()
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold"
        >
          Download Invoice
        </button>
      </div>
    </section>
  );
}