const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors());

// ======================
// RAZORPAY INSTANCE
// ======================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ======================
// CREATE ORDER
// ======================
app.post("/api/create-order", async (req, res) => {
  try {
    let { amount, currency, receipt } = req.body;

    console.log("📩 Incoming order request:", req.body);

    // VALIDATION
    if (!amount || amount < 100) {
      return res.status(400).json({
        error: "Amount must be at least 100 paise",
      });
    }

    const options = {
      amount: Number(amount),
      currency: currency || "INR",
      receipt: receipt || "rcpt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Order created:", order);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error("❌ Create Order Error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ======================
// VERIFY PAYMENT
// ======================
app.post("/api/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment Verified");

      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      console.log("❌ Payment Verification Failed");

      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

  } catch (error) {
    console.error("❌ Verify Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});