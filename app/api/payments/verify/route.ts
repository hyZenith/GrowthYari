
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment Successful
      // Find registration by orderId and update
      const registration = await prisma.eventRegistration.findFirst({
        where: { orderId: razorpay_order_id }
      });

      if (registration) {
        await prisma.eventRegistration.update({
          where: { id: registration.id },
          data: {
            paymentId: razorpay_payment_id,
            paymentStatus: "COMPLETED",
            status: "ACTIVE"
          }
        });
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid Signature" }, { status: 400 });
    }

  } catch (error) {
    console.error("Payment Verify Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
