import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, currency, customerName, customerEmail, merchantName, orderType } = req.body;

  console.log("Payment Intent Request:", { amount, currency, customerName, merchantName, orderType });

  if (!amount || !currency) {
    return res.status(400).json({ error: "Amount and currency are required" });
  }

  // Validate amount is a positive integer
  if (typeof amount !== "number" || amount <= 0 || !Number.isInteger(amount)) {
    return res.status(400).json({ error: "Amount must be a positive integer in cents" });
  }

  try {
    const paymentIntentParams: any = {
      amount,
      currency: currency.toLowerCase(),
      payment_method_types: ["card"],
      metadata: {
        merchantName: merchantName || "Unknown Merchant",
        orderType: orderType?.type || "unknown",
        tableNumber: orderType?.tableNumber || "",
        customerName: customerName || "",
      },
    };

    // Only add receipt_email if it's provided and valid
    if (customerEmail && customerEmail.trim()) {
      paymentIntentParams.receipt_email = customerEmail;
    }

    console.log("Creating Payment Intent with params:", paymentIntentParams);

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    console.log("Payment Intent created:", paymentIntent.id);

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Payment Intent error details:", {
      message: err.message,
      type: err.type,
      code: err.code,
      raw: err.raw,
    });
    res.status(500).json({ error: err.message || "Failed to create payment intent" });
  }
}
