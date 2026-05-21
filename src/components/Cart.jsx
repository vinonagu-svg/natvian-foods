import { useState } from "react";
import jsPDF from "jspdf";

import {
  collection,
  addDoc
} from "firebase/firestore";

import { db }
  from "../firebase";

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
  // 🧾 GST
  // =========================
  const GST_RATE = 0.05;

  const GST_NUMBER =
    "33ATHPN4463C1ZW";

  const HSN_CODE =
    "11061090";

  // =========================
  // 👤 CUSTOMER DETAILS
  // =========================
  const [customerName, setCustomerName] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  // =========================
  // 🚚 STATE
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
  // 💰 OFFER PRICE
  // =========================
  const getOfferPrice = (
    mrp
  ) => {

    const price =
      Number(mrp) || 0;

    if (
      !OFFER_CONFIG.isActive
    ) {

      return price;
    }

    if (
      OFFER_CONFIG.type ===
      "PERCENT"
    ) {

      return (
        price -
        (price *
          OFFER_CONFIG.value) /
          100
      );
    }

    return price;
  };

  // =========================
  // ➕ QTY
  // =========================
  const increaseQty = (
    index
  ) => {

    const updated =
      [...cart];

    updated[index].qty += 1;

    setCart(updated);
  };

  // =========================
  // ➖ QTY
  // =========================
  const decreaseQty = (
    index
  ) => {

    const updated =
      [...cart];

    if (
      updated[index].qty > 1
    ) {

      updated[index].qty -= 1;

      setCart(updated);
    }
  };

  // =========================
  // 💰 TOTALS
  // =========================
  const mrpTotal =
    cart.reduce(
      (
        sum,
        item
      ) => {

        return (
          sum +
          Number(
            item.mrp
          ) *
            Number(
              item.qty
            )
        );

      },
      0
    );

  const offerTotal =
    cart.reduce(
      (
        sum,
        item
      ) => {

        const offerPrice =
          getOfferPrice(
            item.mrp
          );

        return (
          sum +
          offerPrice *
            Number(
              item.qty
            )
        );

      },
      0
    );

  const productDiscount =
    mrpTotal -
    offerTotal;

  // =========================
  // 🎟️ APPLY COUPON
  // =========================
  const applyCoupon = () => {

    if (
      coupon === "SAVE10"
    ) {

      setCouponDiscount(
        offerTotal * 0.1
      );

    } else {

      setCouponDiscount(0);

      alert(
        "Invalid Coupon"
      );
    }
  };

  // =========================
  // 💰 FINAL TOTAL
  // =========================
  const finalAfterCoupon =
    offerTotal -
    couponDiscount;

  // =========================
  // 🧾 GST SPLIT
  // =========================
  const totalGST =
    finalAfterCoupon -
    finalAfterCoupon /
      (1 + GST_RATE);

  const cgst =
    totalGST / 2;

  const sgst =
    totalGST / 2;

  // =========================
  // 🚚 SHIPPING
  // =========================
  const shippingCharge =
    finalAfterCoupon >= 999
      ? 0
      : state ===
        "Tamil Nadu"
      ? 60
      : 100;

  // =========================
  // 💰 GRAND TOTAL
  // =========================
  const grandTotal =
    finalAfterCoupon +
    shippingCharge;

  // =========================
  // 💾 SAVE ORDER
  // =========================
  const saveOrder =
    async () => {

    try {

      await addDoc(
        collection(
          db,
          "orders"
        ),
        {

          id:
            "ORD-" +
            Date.now(),

          customerName,

          phoneNumber,

          address,

          pincode,

          products:
            cart,

          total:
            grandTotal,

          paymentStatus:
            "Pending",

          createdAt:
            new Date().toLocaleString()
        }
      );

      alert(
        "Order Placed Successfully"
      );

    } catch (error) {

      console.error(
        error
      );

      alert(
        "Failed to save order"
      );
    }
  };

  // =========================
  // 📄 PDF INVOICE
  // =========================
  const downloadInvoice =
    () => {

    const doc =
      new jsPDF();

    doc.setFontSize(
      22
    );

    doc.text(
      "NATVIAN FOODS",
      20,
      20
    );

    doc.setFontSize(
      12
    );

    doc.text(
      `GSTIN: ${GST_NUMBER}`,
      20,
      35
    );

    doc.text(
      `HSN: ${HSN_CODE}`,
      20,
      43
    );

    doc.text(
      `Customer: ${customerName}`,
      20,
      55
    );

    doc.text(
      `Phone: ${phoneNumber}`,
      20,
      63
    );

    doc.text(
      `Address: ${address}`,
      20,
      71
    );

    let y = 90;

    doc.text(
      "Products",
      20,
      y
    );

    y += 10;

    cart.forEach(
      (item) => {

        const total =
          getOfferPrice(
            item.mrp
          ) *
          item.qty;

        doc.text(
          `${item.name} (${item.weight}) x ${item.qty}`,
          20,
          y
        );

        doc.text(
          `₹${total.toFixed(
            2
          )}`,
          160,
          y
        );

        y += 10;
      }
    );

    y += 10;

    doc.text(
      `MRP Total: ₹${mrpTotal.toFixed(
        2
      )}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Discount: -₹${productDiscount.toFixed(
        2
      )}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Coupon: -₹${couponDiscount.toFixed(
        2
      )}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `CGST: ₹${cgst.toFixed(
        2
      )}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `SGST: ₹${sgst.toFixed(
        2
      )}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Shipping: ₹${shippingCharge}`,
      20,
      y
    );

    y += 15;

    doc.setFontSize(
      18
    );

    doc.text(
      `Grand Total: ₹${grandTotal.toFixed(
        2
      )}`,
      20,
      y
    );

    doc.save(
      `Invoice-${Date.now()}.pdf`
    );
  };

  return (

    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h1 className="text-4xl font-bold mb-8">

        Shopping Cart

      </h1>

      {cart.length ===
      0 ? (

        <p>
          Your cart is empty
        </p>

      ) : (

        <>

          {/* SHIPPING DETAILS */}
          <div className="bg-gray-50 rounded-3xl p-6 mb-8">

            <h2 className="text-2xl font-bold mb-6">

              Shipping Details

            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <input
                type="text"
                placeholder="Full Name"
                value={
                  customerName
                }
                onChange={(e) =>
                  setCustomerName(
                    e.target
                      .value
                  )
                }
                className="border p-4 rounded-2xl"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={
                  phoneNumber
                }
                onChange={(e) =>
                  setPhoneNumber(
                    e.target
                      .value
                  )
                }
                className="border p-4 rounded-2xl"
              />

              <textarea
                placeholder="Full Address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target
                      .value
                  )
                }
                className="border p-4 rounded-2xl md:col-span-2"
                rows={4}
              />

              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target
                      .value
                  )
                }
                className="border p-4 rounded-2xl"
              />

              <select
                value={state}
                onChange={(e) =>
                  setState(
                    e.target
                      .value
                  )
                }
                className="border p-4 rounded-2xl"
              >

                <option value="Tamil Nadu">
                  Tamil Nadu
                </option>

                <option value="Other">
                  Other States
                </option>

              </select>

            </div>

          </div>

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
              className="border p-4 rounded-2xl flex-1"
            />

            <button
              onClick={
                applyCoupon
              }
              className="bg-black text-white px-6 rounded-2xl"
            >

              Apply

            </button>

          </div>

          {/* PRODUCTS */}
          <div className="space-y-5">

            {cart.map(
              (
                item,
                index
              ) => {

                const offerPrice =
                  getOfferPrice(
                    item.mrp
                  );

                return (

                  <div
                    key={index}
                    className="border rounded-3xl p-5"
                  >

                    <div className="flex flex-col md:flex-row gap-5">

                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        className="w-28 h-28 rounded-2xl object-cover"
                      />

                      <div className="flex-1">

                        <h2 className="text-2xl font-bold">

                          {
                            item.name
                          }

                        </h2>

                        <p className="text-gray-500">

                          {
                            item.weight
                          }

                        </p>

                        <p className="line-through text-gray-400">

                          ₹
                          {
                            item.mrp
                          }

                        </p>

                        <p className="text-3xl font-bold text-green-700">

                          ₹
                          {offerPrice.toFixed(
                            2
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
                            className="bg-gray-200 px-4 py-2 rounded-xl"
                          >

                            -

                          </button>

                          <span className="font-bold">

                            {
                              item.qty
                            }

                          </span>

                          <button
                            onClick={() =>
                              increaseQty(
                                index
                              )
                            }
                            className="bg-gray-200 px-4 py-2 rounded-xl"
                          >

                            +

                          </button>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            index
                          )
                        }
                        className="text-red-500 font-bold"
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
          <div className="border-t mt-10 pt-8 space-y-4">

            <p>
              MRP Total:
              ₹
              {mrpTotal.toFixed(
                2
              )}
            </p>

            <p className="text-green-700">

              Product Discount:
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

              CGST:
              ₹
              {cgst.toFixed(2)}

            </p>

            <p>

              SGST:
              ₹
              {sgst.toFixed(2)}

            </p>

            <p>

              Shipping:
              ₹
              {shippingCharge}

            </p>

            <h2 className="text-4xl font-bold text-green-700">

              Total:
              ₹
              {grandTotal.toFixed(
                2
              )}

            </h2>

          </div>

          {/* BUTTONS */}
          <div className="grid md:grid-cols-2 gap-5 mt-10">

            <button
              onClick={
                downloadInvoice
              }
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold"
            >

              Download Invoice

            </button>

            <button
              onClick={async () => {

                if (
                  !customerName ||
                  !phoneNumber ||
                  !address ||
                  !pincode
                ) {

                  alert(
                    "Please fill all details"
                  );

                  return;
                }

                await saveOrder();

                downloadInvoice();
              }}
              className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold"
            >

              Place Order

            </button>

          </div>

        </>
      )}

    </div>
  );
}