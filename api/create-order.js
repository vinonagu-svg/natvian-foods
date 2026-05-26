import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    console.log("Creating Razorpay order...");

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("Keys loaded");

    const { amount, currency, receipt } = req.body;

    console.log("Request body:", req.body);

    const order = await razorpay.orders.create({
      amount,
      currency: currency || "INR",
      receipt,
    });

    console.log("Order created:", order);

    res.status(200).json(order);

  } catch (error) {
    console.log("RAZORPAY ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
}