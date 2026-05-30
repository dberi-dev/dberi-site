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

  // Validate amount is a positive number
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }

  // Zero-decimal currencies (amounts in whole units, not cents)
  const zeroDecimalCurrencies = [
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
    'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
  ];

  const isZeroDecimal = zeroDecimalCurrencies.includes(currency.toUpperCase());

  // For zero-decimal currencies, amount should be a whole number
  // For other currencies, amount should be in cents (integer)
  if (!isZeroDecimal && !Number.isInteger(amount)) {
    return res.status(400).json({ error: "Amount must be an integer (in cents)" });
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
      param: err.param,
      raw: err.raw,
      statusCode: err.statusCode,
    });

    // Return detailed error for debugging
    const errorMessage = err.message || "Failed to create payment intent";
    const errorDetails = err.type ? `${err.type}: ${errorMessage}` : errorMessage;

    res.status(500).json({
      error: errorDetails,
      details: process.env.NODE_ENV === 'development' ? {
        type: err.type,
        code: err.code,
        param: err.param,
      } : undefined
    });
  }
}
