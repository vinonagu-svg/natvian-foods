import { useState } from "react";
import { db } from "../firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

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
  // CUSTOMER DETAILS
  // =========================
  const [customer, setCustomer] =
    useState({
      name: "",
      phone: "",
      address: "",
      pincode: "",
      city: "",
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
  const OFFER = 10;

  const getOfferPrice = (
    mrp
  ) => {

    const price =
      Number(mrp) || 0;

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
      coupon
        .trim()
        .toUpperCase() ===
      "SAVE10"
    ) {

      setCouponDiscount(
        offerTotal * 0.1
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
  // QUANTITY
  // =========================
  const increaseQty = (i) => {

    const updated = [...cart];

    updated[i].qty += 1;

    setCart(updated);
  };

  const decreaseQty = (i) => {

    const updated = [...cart];

    if (
      updated[i].qty > 1
    ) {

      updated[i].qty -= 1;
    }

    setCart(updated);
  };

  // =========================
  // TOTALS
  // =========================
  const mrpTotal =
    cart.reduce(
      (sum, item) =>

        sum +
        Number(item.mrp) *
          Number(item.qty),

      0
    );

  const offerTotal =
    cart.reduce(
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
  let shipping = 0;

  if (
    finalAfterCoupon >= 999
  ) {

    shipping = 0;

  } else {

    shipping =
      state ===
      "Tamil Nadu"
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
  // DOWNLOAD INVOICE
  // =========================
  const downloadInvoice =
    async (
      paymentId =
        "COD"
    ) => {

    const {
      default: jsPDF,
    } = await import(
      "jspdf"
    );

    const doc =
      new jsPDF();

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

    // COMPANY DETAILS
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

    doc.text(
      `Phone : ${COMPANY.phone}`,
      20,
      82
    );

    // INVOICE DETAILS
    const invoiceNo =
      "INV-" +
      Date.now();

    doc.setFontSize(12);

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

    // CUSTOMER DETAILS
    doc.setFillColor(
      240,
      240,
      240
    );

    doc.rect(
      20,
      92,
      170,
      50,
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
      doc.splitTextToSize(
        `Address : ${customer.address}`,
        140
      ),
      25,
      128
    );

    doc.text(
      `${customer.city} - ${customer.pincode}`,
      25,
      140
    );

    // PRODUCT TABLE
    let y = 160;

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

    // PRODUCTS
    cart.forEach(
      (item) => {

        const amount =
          (
            getOfferPrice(
              item.mrp
            ) * item.qty
          ).toFixed(2);

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
          `Rs.${amount}`,
          155,
          y
        );

        y += 10;
      }
    );

    // TOTALS
    y += 10;

    doc.line(
      20,
      y,
      190,
      y
    );

    y += 10;

    doc.text(
      `MRP Total : Rs.${mrpTotal.toFixed(
        2
      )}`,
      120,
      y
    );

    y += 8;

    doc.text(
      `Offer Discount : Rs.${(
        mrpTotal -
        offerTotal
      ).toFixed(2)}`,
      120,
      y
    );

    y += 8;

    doc.text(
      `Coupon Discount : Rs.${couponDiscount.toFixed(
        2
      )}`,
      120,
      y
    );

    y += 8;

    doc.text(
      `CGST (2.5%) : Rs.${cgst.toFixed(
        2
      )}`,
      120,
      y
    );

    y += 8;

    doc.text(
      `SGST (2.5%) : Rs.${sgst.toFixed(
        2
      )}`,
      120,
      y
    );

    y += 8;

    doc.text(
      `Shipping : Rs.${shipping.toFixed(
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
      `Grand Total : Rs.${grandTotal.toFixed(
        2
      )}`,
      110,
      y
    );

    // FOOTER
    y += 25;

    doc.setFontSize(10);

    doc.setTextColor(
      80,
      80,
      80
    );

    doc.text(
      "Thank you for shopping with Natvian Foods",
      20,
      y
    );

    y += 8;

    doc.text(
      "This is a computer generated invoice.",
      20,
      y
    );

    doc.save(
      `${invoiceNo}.pdf`
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
      !customer.pincode ||
      !customer.city
    ) {

      alert(
        "Please fill all customer details"
      );

      return;
    }

    if (
      cart.length === 0
    ) {

      alert(
        "Cart is empty"
      );

      return;
    }

    try {

      setLoading(true);

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

                  receipt:
                    "receipt_" +
                    Date.now(),
                }
              ),
          }
        );

      const order =
        await response.json();

      if (!order.id) {

        setLoading(false);

        alert(
          "Order creation failed"
        );

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
          color:
            "#31572C",
        },

        handler:
          async function (
            response
          ) {

          try {

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
                "Payment Verification Failed ❌"
              );

              setLoading(
                false
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

                city:
                  customer.city,

                pincode:
                  customer.pincode,

                state,

                products:
                  cart.map(
                    (
                      item
                    ) => ({
                      name:
                        item.name ||
                        "",

                      weight:
                        item.weight ||
                        "",

                      qty:
                        Number(
                          item.qty
                        ) || 1,

                      mrp:
                        Number(
                          item.mrp
                        ) || 0,

                      image:
                        item.image ||
                        "",
                    })
                  ),

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
                  Date.now(),
              }
            );

            await downloadInvoice(
              response.razorpay_payment_id
            );

            alert(
              "🎉 Order Placed Successfully!"
            );

            setCart([]);

            setCustomer({
              name: "",
              phone: "",
              address:
                "",
              pincode:
                "",
              city: "",
            });

            setCoupon("");

            setCouponDiscount(
              0
            );

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

    <section className="max-w-5xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8 text-[#31572C]">
        Shopping Cart
      </h1>

      {cart.length === 0 && (

        <div className="border p-10 text-center bg-white rounded-2xl">

          <h2 className="text-2xl font-bold">
            Your Cart is Empty 🛒
          </h2>

        </div>
      )}

      {/* CART ITEMS */}
      <div className="space-y-4">

        {cart.map(
          (item, i) => (

            <div
              key={i}
              className="border rounded-2xl p-4 flex flex-col md:flex-row justify-between md:items-center bg-white gap-4"
            >

              <div className="flex gap-4 items-center">

                <img
                  src={
                    item.image ||
                    "/Logo.webp"
                  }
                  alt={
                    item.name
                  }
                  className="w-24 h-24 object-cover rounded-2xl border"
                />

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

                  <p className="text-green-600 font-bold text-lg">
                    ₹
                    {getOfferPrice(
                      item.mrp
                    ).toFixed(
                      2
                    )}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    decreaseQty(
                      i
                    )
                  }
                  className="bg-gray-200 w-10 h-10 rounded-xl font-bold"
                >
                  -
                </button>

                <span className="font-bold text-lg">
                  {item.qty}
                </span>

                <button
                  onClick={() =>
                    increaseQty(
                      i
                    )
                  }
                  className="bg-gray-200 w-10 h-10 rounded-xl font-bold"
                >
                  +
                </button>

                <button
                  onClick={() =>
                    removeFromCart(
                      i
                    )
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  Remove
                </button>

              </div>

            </div>
          )
        )}

      </div>

      {/* ORDER SUMMARY */}
      <div className="mt-10 border rounded-3xl p-6 bg-white shadow-sm">

        <h2 className="text-2xl font-bold mb-6">
          Order Summary
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>
              MRP Total
            </span>

            <span>
              ₹
              {mrpTotal.toFixed(
                2
              )}
            </span>
          </div>

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
              Coupon Discount
            </span>

            <span className="text-red-500">
              -₹
              {couponDiscount.toFixed(
                2
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              CGST (2.5%)
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
              SGST (2.5%)
            </span>

            <span>
              ₹
              {sgst.toFixed(
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

          {shipping === 0 && (
            <p className="text-green-600 font-bold">
              🎉 Free Shipping Applied
            </p>
          )}

        </div>

        <div className="border-t mt-5 pt-5 flex justify-between text-3xl font-bold text-[#31572C]">

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

      {/* PAYMENT BUTTON */}
      <div className="mt-8">

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

      </div>

    </section>
  );
}