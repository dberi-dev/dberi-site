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

  const { priceId } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: "Price ID is required" });
  }

  try {
    // Determine plan name based on price ID
    let plan = "unknown";
    if (priceId === "price_1Tc0xQCZX9LsXZgVc0CjFp82") plan = "small_business";
    if (priceId === "price_1Tc0xpCZX9LsXZgVCwB1VxI9") plan = "professional";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: req.body.email, // Optional: pre-fill email if provided
      allow_promotion_codes: true,
      billing_address_collection: "required",
      metadata: {
        plan,
      },
      success_url: `${req.headers.origin || "https://dberi.com"}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || "https://dberi.com"}/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
