import crypto from "crypto";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  console.log("Webhook Hit");

  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "Webhook endpoint working",
    });
  }

  try {
    // Webhook secret from Vercel Environment Variables
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Razorpay signature from headers
    const razorpaySignature =
      req.headers["x-razorpay-signature"];

    // Request body
    const body = JSON.stringify(req.body);

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    // Verify webhook signature
    if (expectedSignature !== razorpaySignature) {
      console.log("Invalid Signature");

      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    console.log("Webhook verified successfully");

    // Razorpay event
    const event = req.body.event;

    console.log("Event:", event);

    // Handle events
    switch (event) {
      case "payment.captured":
        console.log("Payment Captured");

        // Payment details
        const payment =
          req.body.payload.payment.entity;

        console.log("Payment ID:", payment.id);
        console.log("Amount:", payment.amount / 100);
        console.log("Email:", payment.email);
        console.log("Contact:", payment.contact);

        // TODO:
        // Save order in DB
        // Send confirmation email
        // Update inventory

        break;

      case "payment.failed":
        console.log("Payment Failed");

        console.log(req.body.payload.payment.entity);

        break;

      case "order.paid":
        console.log("Order Paid");

        console.log(req.body.payload.order.entity);

        break;

      default:
        console.log("Unhandled event:", event);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    console.log("Webhook Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}