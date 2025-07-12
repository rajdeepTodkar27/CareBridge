
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(signatureBody)
      .digest("hex")

    if (expectedSignature === razorpay_signature) {
      return NextResponse.json({ success: true, message: "Payment verified" }, { status: 200 })
    } else {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ success: false, message: "Server error during verification" }, { status: 500 })
  }
}
