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

  const { lineItems, merchantName, orderType } = req.body;

  if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
    return res.status(400).json({ error: "Line items are required" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        merchantName: merchantName || "Unknown Merchant",
        orderType: orderType?.type || "unknown",
        tableNumber: orderType?.tableNumber || "",
      },
      success_url: `${req.headers.origin || "https://dberi.com"}/menu/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || "https://dberi.com"}/menu/${merchantName}?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
}
