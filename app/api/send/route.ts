import { NextResponse } from "next/server";
import { NodeMail } from "@/app/utils/NodeMail";

export async function POST(req: Request) {
  const { to, subject, text } = await req.json();
  try {
    await NodeMail(to, subject, text);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
