import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
      payment_capture: true,
      notes: {
        message: "Payment for Job Listing - Workro!",
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.log("Error on creating order", error);
    return NextResponse.json(
      { error: "Error on creating order" },
      { status: 500 }
    );
  }
}
