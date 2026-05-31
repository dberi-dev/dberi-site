import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({ error: "No signature" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Get customer details
        const customerId = session.customer as string;
        const customer = await stripe.customers.retrieve(customerId);

        if (customer.deleted) {
          console.error("Customer was deleted");
          break;
        }

        // Create pending merchant account in backend
        const merchantData = {
          business_name: customer.name || customer.email?.split("@")[0] || "New Merchant",
          email: customer.email,
          stripe_customer_id: customerId,
          stripe_subscription_id: session.subscription as string,
          subscription_plan: session.metadata?.plan || "unknown",
          slug: `merchant-${customerId.slice(-8)}`, // Temporary slug, can be changed later
          category: "other",
          status: "pending", // Requires admin approval
        };

        console.log("Creating pending merchant account:", merchantData);

        try {
          const response = await fetch("https://api.dberi.com/v1/merchants/create-from-stripe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.DBERI_API_KEY}`,
            },
            body: JSON.stringify(merchantData),
          });

          if (!response.ok) {
            const error = await response.text();
            console.error("Failed to create merchant:", error);
          } else {
            const result = await response.json();
            console.log("Merchant created successfully:", result);
          }
        } catch (error) {
          console.error("Error calling backend API:", error);
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("Subscription updated:", {
          customer: subscription.customer,
          subscription_id: subscription.id,
          status: subscription.status,
        });

        // TODO: Update merchant subscription status in your backend
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("Subscription cancelled:", {
          customer: subscription.customer,
          subscription_id: subscription.id,
        });

        // TODO: Handle subscription cancellation in your backend
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log("Payment succeeded:", {
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata,
        });

        // Extract merchant info from metadata
        const merchantId = paymentIntent.metadata.merchantId;
        const merchantName = paymentIntent.metadata.merchantName || "Unknown Merchant";
        const customerName = paymentIntent.metadata.customerName || "Guest";

        if (!merchantId) {
          console.error("No merchant ID in payment intent metadata");
          break;
        }

        // Create charge in backend
        try {
          const response = await fetch(`https://api.dberi.com/v1/merchants/${merchantId}/charges`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.DBERI_API_KEY}`,
            },
            body: JSON.stringify({
              merchant_id: merchantId,
              amount: paymentIntent.amount,
              description: `Payment from ${customerName}`,
              customer_user_id: null, // Can be added if customer auth is implemented
            }),
          });

          if (!response.ok) {
            const error = await response.text();
            console.error("Failed to create charge:", error);
          } else {
            const result = await response.json();
            console.log("Charge created successfully:", result);
          }
        } catch (error) {
          console.error("Error calling backend API to create charge:", error);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: err.message });
  }
}
