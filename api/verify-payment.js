// api/verify-payment.js

import crypto from "crypto";

export default async function handler(req, res) {

  console.log("VERIFY PAYMENT API HIT");

  // =========================
  // ALLOW ONLY POST
  // =========================
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {

    // =========================
    // GET PAYMENT DATA
    // =========================
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log("ORDER ID:", razorpay_order_id);
    console.log("PAYMENT ID:", razorpay_payment_id);

    // =========================
    // VALIDATION
    // =========================
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment fields",
      });
    }

    // =========================
    // GENERATE SIGNATURE
    // =========================
    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    console.log(
      "EXPECTED SIGNATURE:",
      expectedSignature
    );

    console.log(
      "RAZORPAY SIGNATURE:",
      razorpay_signature
    );

    // =========================
    // VERIFY SIGNATURE
    // =========================
    if (
      expectedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    console.log(
      "PAYMENT VERIFIED SUCCESSFULLY"
    );

    // =========================
    // SUCCESS RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
    });

  } catch (error) {

    console.log(
      "VERIFY PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment verification failed",
    });
  }
}