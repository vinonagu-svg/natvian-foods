import Razorpay from "razorpay";

export default async function handler(req, res) {
  try {
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
      receipt: "test_receipt",
    });

    return res.status(200).json(order);

  } catch (error) {
    console.log("FULL ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}