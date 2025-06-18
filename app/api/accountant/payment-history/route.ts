import { NextResponse,NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connect } from "@/dbconfig/dbconfig";
import Payment from "@/models/Payment";
import AllCare from "@/models/AllCare";

export async function GET() {
    try {
        await connect();
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== "accountant"){
            return NextResponse.json({error: "Unauthorized"}, {status:401})
        }

        const hospital = await AllCare.findOne({centerId: session.user.centerId})
        if(!hospital){
            return NextResponse.json({error: "Not found the care centre"},{status: 404})
        }

        const paymentHis = await Payment.find({hospital: hospital._id})
        .populate({path: "hospital", select: "name type"})
        .populate({path: "patient", select: "email"})
        .populate({path: "service", populate: {path: "service", select: "serviceName baseCost"}, select: "service unit totalCost dateProvided"})
        .select("-subscription")

        if(!paymentHis){
            return NextResponse.json({error: "Not found Payment History"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched the payments history", data: paymentHis}, {status: 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})

    }
}