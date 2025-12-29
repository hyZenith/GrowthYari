
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";

export async function POST(req: Request) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay credentials missing" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { eventId } = await req.json();

    // 1. Auth Check
    const userPayload = await getUser();
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = userPayload.userId;

    // 2. Fetch Event
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (event.price === 0) {
      return NextResponse.json({ error: "Event is free" }, { status: 400 });
    }

    // 3. Create Razorpay Order
    // Amount is in shortest currency unit (paise for INR). So price * 100.
    const amount = Math.round(event.price * 100); 
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${userId.slice(0, 5)}_${eventId.slice(0, 5)}`,
    };

    const order = await razorpay.orders.create(options);

    // 4. Create Pending Registration (or update existing)
    // We create a record so we can track this attempt. 
    // If verification fails, it stays PENDING.
    // If user cancels payment flow, it stays PENDING.
    // Ideally we should use upsert to avoid duplicate pending records if user retries.
    
    await prisma.eventRegistration.upsert({
      where: {
        userId_eventId: { userId, eventId }
      },
      update: {
        paymentStatus: "PENDING",
        orderId: order.id,
        amountPaid: event.price,
        status: "ACTIVE" // Temporarily ACTIVE or PENDING? Schema says ACTIVE/CANCELLED. 
        // Logic: Keep it active but paymentStatus pending? 
        // Or strictly add PENDING to RegistrationStatus?
        // Schema only has ACTIVE/CANCELLED. 
        // Let's keep it ACTIVE for registration existence, but paymentStatus PENDING implies not fully confirmed payment-wise?
        // Actually, if payment fails, we might want to treat it as reserved or just PENDING payment.
        // For simplicity: Create/Update entry storing the Order ID.
      },
      create: {
        userId,
        eventId,
        paymentStatus: "PENDING",
        orderId: order.id,
        amountPaid: event.price,
        status: "ACTIVE" 
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Payment Order Error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
