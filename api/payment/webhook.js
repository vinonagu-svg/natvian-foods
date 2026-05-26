import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

// =========================
// READ RAW BODY
// =========================
async function buffer(readable) {

  const chunks = [];

  for await (const chunk of readable) {

    chunks.push(
      typeof chunk === "string"
        ? Buffer.from(chunk)
        : chunk
    );
  }

  return Buffer.concat(chunks);
}

export default async function handler(
  req,
  res
) {

  console.log("🚀 WEBHOOK HIT");

  // =========================
  // ALLOW ONLY POST
  // =========================
  if (req.method !== "POST") {

    return res.status(200).json({
      message:
        "Webhook endpoint working",
    });
  }

  try {

    // =========================
    // GET RAW BODY
    // =========================
    const rawBody =
      await buffer(req);

    const body =
      rawBody.toString();

    // =========================
    // GET SIGNATURE
    // =========================
    const razorpaySignature =
      req.headers[
        "x-razorpay-signature"
      ];

    // =========================
    // WEBHOOK SECRET
    // =========================
    const secret =
      process.env
        .RAZORPAY_WEBHOOK_SECRET;

    // =========================
    // CREATE EXPECTED SIGNATURE
    // =========================
    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(body)
        .digest("hex");

    // =========================
    // VERIFY SIGNATURE
    // =========================
    if (
      expectedSignature !==
      razorpaySignature
    ) {

      console.log(
        "❌ INVALID SIGNATURE"
      );

      return res.status(400).json({
        success: false,
        message:
          "Invalid signature",
      });
    }

    console.log(
      "✅ WEBHOOK VERIFIED"
    );

    // =========================
    // PARSE JSON BODY
    // =========================
    const eventData =
      JSON.parse(body);

    const event =
      eventData.event;

    console.log(
      "📩 EVENT:",
      event
    );

    // =========================
    // HANDLE EVENTS
    // =========================
    switch (event) {

      case "payment.captured":

        console.log(
          "💰 PAYMENT CAPTURED"
        );

        const payment =
          eventData.payload
            .payment.entity;

        console.log(
          "PAYMENT ID:",
          payment.id
        );

        console.log(
          "AMOUNT:",
          payment.amount / 100
        );

        console.log(
          "EMAIL:",
          payment.email
        );

        console.log(
          "CONTACT:",
          payment.contact
        );

        break;

      case "payment.failed":

        console.log(
          "❌ PAYMENT FAILED"
        );

        console.log(
          eventData.payload
            .payment.entity
        );

        break;

      case "order.paid":

        console.log(
          "✅ ORDER PAID"
        );

        console.log(
          eventData.payload
            .order.entity
        );

        break;

      default:

        console.log(
          "⚠️ UNHANDLED EVENT:",
          event
        );
    }

    // =========================
    // SUCCESS RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      message:
        "Webhook received",
    });

  } catch (error) {

    console.log(
      "❌ WEBHOOK ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message,
    });
  }
}