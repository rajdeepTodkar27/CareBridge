import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import Payment from "@/models/Payment";
import SubscriptionPlans from "@/models/SubscriptionPlans";

 

export async function POST(req: NextRequest) {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "patient") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { plan, billingCycle, paymentId, paymentMethod, price } = await req.json();

    const now = new Date();

    const subscriptionPlan = await SubscriptionPlans.findById(plan)
    if(!subscriptionPlan) return NextResponse.json({error: "not found subscription plan"},{status: 404})

    let endingDate = new Date(now);
    if (billingCycle === "monthly") {
      endingDate.setMonth(now.getMonth() + 1);
    } else if (billingCycle === "yearly") {
      endingDate.setFullYear(now.getFullYear() + 1);
    } else {
      return NextResponse.json({ error: "Invalid billing cycle" }, { status: 400 });
    }

    const subscribe = new Subscription({
      patient: user._id,
      plan,
      billingCycle,
      startingDate: now,
      endingDate,
      availableFreeConsultions: subscriptionPlan.freeConsultions,
      pharmacyDiscount: subscriptionPlan.pharmacyDiscount,
      status: "active",
      paymentMethod,
      paymentId,
      price,
    });

    await subscribe.save();

    const payment = new Payment({
      patient: user._id,
      date: now,
      subscription: subscribe._id,
      paymentMethod,
      paymentId,
      hospital: null,
      service: []
    });

    await payment.save();

    return NextResponse.json({ message: "Plan subscribed successfully" }, { status: 201 });

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions);
        if(!session || session.user.role != "patient" ){
            return NextResponse.json({error: "Unauthorized user"},{status: 401})
        }
        const user = await User.findOne({email: session.user.email})
        if(!user){
            return NextResponse.json({error: "user not found"},{status: 404})
        }
        const subscription = await Subscription.findOne({patient:user._id ,status: "active"}).populate({path: "plan", select: "freeConsultions planName price"})
        if(!subscription) {
            return NextResponse.json({error: "subscription not found"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched the subscription details",data: subscription},{status: 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}