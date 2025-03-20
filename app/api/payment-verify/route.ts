import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/utils/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      jobId,
      isFree,
    } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing required job ID" },
        { status: 400 }
      );
    }

    const jobPost = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!jobPost) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (isFree) {
      const updatedJob = await prisma.jobPost.update({
        where: { id: jobId },
        data: { status: "ACTIVE" },
      });

      console.log("Free job activated:", updatedJob);
      return NextResponse.json({ message: "✅ Free job activated!" });
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.jobPost.update({
      where: { id: jobId },
      data: { status: "ACTIVE" },
    });

    return NextResponse.json({
    });
  } catch (error) {
    console.error(" Error verifying payment:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
