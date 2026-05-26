// src/RazorpayButton.jsx

import React from "react";

export default function RazorpayButton() {

  // =========================
  // LOAD RAZORPAY SDK
  // =========================
  const loadScript = () => {

    return new Promise((resolve) => {

      // Avoid loading script twice
      const existingScript =
        document.getElementById(
          "razorpay-script"
        );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.id =
        "razorpay-script";

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {

        console.log(
          "Razorpay SDK Loaded"
        );

        resolve(true);
      };

      script.onerror = () => {

        console.log(
          "Failed to load Razorpay SDK"
        );

        resolve(false);
      };

      document.body.appendChild(
        script
      );
    });
  };

  // =========================
  // HANDLE PAYMENT
  // =========================
  const handlePayment = async () => {

    try {

      // Load SDK
      const scriptLoaded =
        await loadScript();

      if (!scriptLoaded) {

        alert(
          "Failed to load Razorpay SDK"
        );

        return;
      }

      // =========================
      // CREATE ORDER
      // =========================
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
              amount: 100,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "CREATE ORDER RESPONSE:",
        data
      );

      // =========================
      // IMPORTANT FIX
      // =========================
      const orderId =
        data.order_id || data.id;

      if (!orderId) {

        alert(
          data.message ||
          data.error ||
          "Order creation failed"
        );

        return;
      }

      // =========================
      // RAZORPAY OPTIONS
      // =========================
      const options = {

        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          data.amount,

        currency:
          data.currency,

        order_id:
          orderId,

        name:
          "The Native Food",

        description:
          "Order Payment",

        image:
          "https://www.thenativefood.com/favicon.ico",

        handler:
          async function (
            response
          ) {

            try {

              // =========================
              // VERIFY PAYMENT
              // =========================
              const verifyResponse =
                await fetch(
                  "/api/verify-payment",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify({
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

              console.log(
                "VERIFY RESPONSE:",
                verifyData
              );

              if (
                verifyData.success
              ) {

                alert(
                  "Payment Successful"
                );

              } else {

                alert(
                  "Payment Verification Failed"
                );
              }

            } catch (error) {

              console.log(
                "VERIFY ERROR:",
                error
              );

              alert(
                "Verification Failed"
              );
            }
          },

        modal: {

          ondismiss:
            function () {

              alert(
                "Payment popup closed"
              );
            },
        },

        prefill: {

          name:
            "Customer",

          email:
            "customer@example.com",

          contact:
            "9876543210",
        },

        notes: {

          business:
            "The Native Food",
        },

        theme: {
          color:
            "#000000",
        },
      };

      // =========================
      // OPEN RAZORPAY
      // =========================
      const paymentObject =
        new window.Razorpay(
          options
        );

      // Payment Failed Event
      paymentObject.on(
        "payment.failed",

        function (response) {

          console.log(
            "PAYMENT FAILED:",
            response.error
          );

          alert(
            response.error.description ||
            "Payment Failed"
          );
        }
      );

      paymentObject.open();

    } catch (error) {

      console.log(
        "PAYMENT ERROR:",
        error
      );

      alert(
        "Something went wrong"
      );
    }
  };

  return (

    <button
      onClick={handlePayment}
      className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
    >
      Pay Now
    </button>
  );
}