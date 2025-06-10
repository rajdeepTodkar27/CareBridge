import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Payment from "@/models/Payment";



export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== "patient"){
            return NextResponse.json({error: "Unauthorized"},{status: 401})
        }
        const email = session.user.email
        const user = await User.findOne({email})
        const paymentHis = await Payment.find({patient: user._id})
        .populate({path: "hospital", select: "centerId name city email -_id"})
        .populate({path: "service", populate: {path: "service", select:"serviceName"},select: "totalCost -_id"})
        .populate({path: "subscription", populate: {path:"plan",select:"planName billingCycle"},select: "-_id -paymentId -paymentMethod -status -endingDate -startingDate"})
        .select("-patient -_id")
        if(!paymentHis){
            return NextResponse.json({error: "Not found payment history"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched payment history",data: paymentHis},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}


// sample responce 
// {
//       "date": "2025-06-10T10:00:00.000Z",
//       "hospital": {
//         "centerId": "HOSP001",
//         "name": "AllCare Hospital",
//         "city": "Mumbai",
//         "email": "contact@allcare.com"
//       },
//       "service": {
//         "totalCost": 1200,
//         "service": {
//           "serviceName": "MRI Scan"
//         }
//       },
//       "subscription": {
//         "plan": {
//           "planName": "Premium Plan",
//           "billingCycle": "monthly"
//         }
//       },
//       "paymentMethod": "upi",
//       "paymentId": "pay_xyz_123456"
//     }