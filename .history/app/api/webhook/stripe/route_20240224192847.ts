import stripe from "stripe";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/order.actions";
import User from "@/lib/database/models/user.model";

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  // Get the ID and type
  const eventType = event.type;

  // CREATE
  // if (eventType === "checkout.session.completed") {
  //   const { id, amount_total, metadata } = event.data.object;

  //   const order = {
  //     stripeId: id,
  //     eventId: metadata?.eventId || "",
  //     buyerId: metadata?.buyerId || "",
  //     totalAmount: amount_total ? (amount_total / 100).toString() : "0",
  //     createdAt: new Date(),
  //   };

  //   const newOrder = await createOrder(order);
  //   return NextResponse.json({ message: "OK", order: newOrder });
  // }

  if (eventType === "account.updated") {
    const account = event.data.object;
    console.log("Charges enabled: ", account.charges_enabled);

    return NextResponse.json({ message: "OK" });
  }

  return new Response("", { status: 200 });
}
