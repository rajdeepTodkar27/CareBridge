
import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount } = body

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error("Razorpay Order Error:", err)
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 })
  }
}
