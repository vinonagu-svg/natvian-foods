import Razorpay from "razorpay";

export default async function handler(req, res) {

  console.log("🚀 CREATE ORDER API HIT");

  // =========================
  // ALLOW ONLY POST
  // =========================
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {

    // =========================
    // ENV VARIABLES CHECK
    // =========================
    console.log(
      "✅ KEY ID EXISTS:",
      !!process.env.RAZORPAY_KEY_ID
    );

    console.log(
      "✅ KEY SECRET EXISTS:",
      !!process.env.RAZORPAY_KEY_SECRET
    );

    // =========================
    // CREATE RAZORPAY INSTANCE
    // =========================
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret:
        process.env.RAZORPAY_KEY_SECRET,
    });

    // =========================
    // GET DATA FROM FRONTEND
    // =========================
    const {
      amount,
      currency,
      receipt,
    } = req.body;

    console.log(
      "📩 RECEIVED BODY:",
      req.body
    );

    // =========================
    // VALIDATION
    // =========================
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount",
      });
    }

    // =========================
    // CONVERT RUPEES TO PAISE
    // =========================
    const finalAmount =
      Math.round(Number(amount) * 100);

    console.log(
      "💰 FINAL AMOUNT IN PAISE:",
      finalAmount
    );

    // =========================
    // CREATE ORDER
    // =========================
    const order =
      await razorpay.orders.create({
        amount: finalAmount,
        currency: currency || "INR",
        receipt:
          receipt ||
          "receipt_" + Date.now(),
      });

    console.log(
      "✅ ORDER CREATED:",
      order
    );

    // =========================
    // SUCCESS RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {

    console.log(
      "❌ FULL RAZORPAY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.error?.description ||
        error.message ||
        "Order creation failed",
    });
  }
}