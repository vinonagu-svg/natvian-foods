import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const receivedSignature =
      req.headers["x-razorpay-signature"];

    if (expectedSignature === receivedSignature) {
      console.log("Webhook verified");

      const event = req.body.event;

      if (event === "payment.captured") {
        console.log("Payment captured");
      }

      if (event === "payment.failed") {
        console.log("Payment failed");
      }

      return res.status(200).json({
        success: true,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}