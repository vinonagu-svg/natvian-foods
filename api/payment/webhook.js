import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "Webhook endpoint working",
    });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const signature = req.headers["x-razorpay-signature"];

  if (expectedSignature === signature) {
    console.log("Webhook verified");

    return res.status(200).json({
      success: true,
    });
  }

  return res.status(400).json({
    success: false,
  });
}