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

        // Create merchant account in your backend
        const merchantData = {
          email: customer.email,
          stripe_customer_id: customerId,
          stripe_subscription_id: session.subscription as string,
          plan: session.metadata?.plan || "unknown",
          name: customer.name || customer.email?.split("@")[0] || "Merchant",
        };

        console.log("Creating merchant account:", merchantData);

        // TODO: Call your backend API to create the merchant
        // Example:
        // const response = await fetch("https://api.dberi.com/merchants", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(merchantData),
        // });

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

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: err.message });
  }
}
