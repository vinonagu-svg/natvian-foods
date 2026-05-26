import Razorpay from "razorpay";

export default async function handler(req, res) {

  console.log("API HIT");

  console.log(
    "KEY ID:",
    process.env.RAZORPAY_KEY_ID
  );

  console.log(
    "SECRET EXISTS:",
    !!process.env.RAZORPAY_KEY_SECRET
  );

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret:
        process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    console.log("AMOUNT:", amount);

    const order =
      await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt:
          "receipt_" + Date.now(),
      });

    console.log("ORDER:", order);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {

    console.log(
      "FULL RAZORPAY ERROR:",
      JSON.stringify(error, null, 2)
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}