// api/create-order.js

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum amount is 100 paise",
      });
    }

    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.log("Create Order Error:", error);

    if (error.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}