// src/RazorpayButton.jsx

import React from "react";

export default function RazorpayButton() {

  const loadScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {

    const scriptLoaded = await loadScript();

    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {

      const amount = 100;

      const response = await fetch(
        "/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Order creation failed");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,

        name: "The Native Food",

        description: "Order Payment",

        handler: async function (response) {

          const verifyResponse = await fetch(
            "/api/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }),
            }
          );

          const verifyData =
            await verifyResponse.json();

          if (verifyData.success) {
            alert("Payment Successful");
          } else {
            alert("Payment Verification Failed");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment popup closed");
          },
        },

        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9876543210",
        },

        theme: {
          color: "#000000",
        },
      };

      const paymentObject =
        new window.Razorpay(options);

      paymentObject.on(
        "payment.failed",
        function (response) {
          console.log(response.error);
          alert("Payment Failed");
        }
      );

      paymentObject.open();

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-black text-white px-6 py-3 rounded-lg"
    >
      Pay Now
    </button>
  );
}