import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/dbconfig/dbconfig";
import DoctorAppointmentRequest from "@/models/DoctorAppointmentRequest";
import RegularCheckup from "@/models/RegularCheckup";


export async function PUT(req: NextRequest) {
    try {
        await connect()
        const {reqId,responceFromH,requestStatus,sheduledDate,sheduledTime}=await req.json();
        const dateTime = sheduledDate+"T"+sheduledTime
        const appReq = await DoctorAppointmentRequest.findByIdAndUpdate(reqId,{$set: {responceFromH,requestStatus,scheduledTime:dateTime}})
        if(!appReq){
            return NextResponse.json({error: "appointment request not found"},{status: 404})
        }
        if(requestStatus==="approved"){
            const regularCheckup =new RegularCheckup({ appointmentRequest: appReq._id, treatmentServices: []})
            await regularCheckup.save()
        }
        return NextResponse.json({message: "successfully responded to the appointment request"},{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}

export async function GET() {
    try {
        await connect()
        const session = await  getServerSession(authOptions);
        if(!session){
            return NextResponse.json({error: "Unauthorized user"},{status: 401})
        } 
        const centerId =  session.user.centerId
        const appointments = await DoctorAppointmentRequest.find({hospitalCenterId: centerId,requestStatus: {$in: ["pending","rejected"]}})
        .populate({path: "patient",select: "fullName ",populate: {path: "user", select: "email"} })
        .populate({path: "doctor",select:"fullName empId" })
        .populate({path: "subscription",select: "endingDate" })
        .select('description requestDateTime requestStatus')

        if(!appointments){
            return NextResponse.json({message: "no appointment reqests found"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched appointment requests", data: appointments},{status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}