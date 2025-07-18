import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import PatientsProfile from "@/models/PatientsProfile";
import User from "@/models/User";
import DoctorAppointmentRequest from "@/models/DoctorAppointmentRequest";
import "@/models/ServiceUsage";
import "@/models/Services";



export async function GET() {
    try {
        await connect();
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "patient"){
            return NextResponse.json({error: "Unauthorized"},{status: 401})
        }
        const user = await User.findOne({email: session.user.email})
        const profile = await PatientsProfile.findOne({patient: user._id})
        if(!profile){
            return NextResponse.json({error: "profile not found"},{status: 404})
        }
        const docAppointment = await DoctorAppointmentRequest.find({patient: profile._id, requestStatus: {$in: ["rejected","pending"]} })

        return NextResponse.json({
            message: "data fetched successfully",
            data: {
                appReq: docAppointment,
            }
        },{status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}