import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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
  // DOWNLOAD INVOICE
  // =========================
  const downloadInvoice =
    async () => {

    const { default: jsPDF } =
      await import("jspdf");

    const doc =
      new jsPDF();

    // HEADER
    doc.setFontSize(22);

    doc.text(
      COMPANY.name,
      20,
      20
    );

    doc.setFontSize(11);

    doc.text(
      COMPANY.address,
      20,
      30
    );

    doc.text(
      `GSTIN: ${COMPANY.gstin}`,
      20,
      38
    );

    doc.text(
      `FSSAI: ${COMPANY.fssai}`,
      20,
      46
    );

    doc.text(
      `PAN: ${COMPANY.pan}`,
      20,
      54
    );

    // INVOICE INFO
    doc.setFontSize(13);

    doc.text(
      `Invoice No: INV-${Date.now()}`,
      20,
      70
    );

    doc.text(
      `Date: ${new Date().toLocaleDateString()}`,
      20,
      78
    );

    // CUSTOMER DETAILS
    doc.setFontSize(12);

    doc.text(
      `Customer: ${customer.name}`,
      20,
      95
    );

    doc.text(
      `Phone: ${customer.phone}`,
      20,
      103
    );

    doc.text(
      `Address: ${customer.address}`,
      20,
      111
    );

    doc.text(
      `Pincode: ${customer.pincode}`,
      20,
      119
    );

    doc.text(
      `State: ${state}`,
      20,
      127
    );

    // PRODUCTS
    let y = 145;

    doc.setFontSize(14);

    doc.text(
      "Products",
      20,
      y
    );

    y += 10;

    doc.setFontSize(11);

    cart.forEach((item) => {

      doc.text(
        `${item.name} (${item.weight}) x ${item.qty}`,
        20,
        y
      );

      doc.text(
        `₹${(
          getOfferPrice(
            item.mrp
          ) * item.qty
        ).toFixed(2)}`,
        160,
        y
      );

      y += 10;
    });

    // TOTALS
    y += 10;

    doc.text(
      `MRP Total: ₹${mrpTotal.toFixed(2)}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Offer Total: ₹${offerTotal.toFixed(2)}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Coupon Discount: ₹${couponDiscount.toFixed(2)}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `CGST (2.5%): ₹${cgst.toFixed(2)}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `SGST (2.5%): ₹${sgst.toFixed(2)}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Shipping: ₹${shipping.toFixed(2)}`,
      20,
      y
    );

    y += 12;

    doc.setFontSize(16);

    doc.text(
      `Grand Total: ₹${grandTotal.toFixed(2)}`,
      20,
      y
    );

    // FOOTER
    y += 20;

    doc.setFontSize(10);

    doc.text(
      "Thank you for shopping with Natvian Foods",
      20,
      y
    );

    y += 8;

    doc.text(
      "This is a computer generated invoice",
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

      alert(
        "Cart is empty"
      );

      return;
    }

    try {

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
                  new Date().toLocaleString(),
              }
            );

            alert(
              "🎉 Order Placed Successfully!"
            );

            await downloadInvoice();

            setCart([]);

          } catch (error) {

            console.error(
              error
            );

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

      console.error(
        error
      );

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

    </section>
  );
}