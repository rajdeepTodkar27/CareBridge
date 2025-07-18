import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import PatientsProfile from "@/models/PatientsProfile";
import User from "@/models/User";
import DoctorAppointmentRequest from "@/models/DoctorAppointmentRequest";
import Subscription from "@/models/Subscription";
import RegularCheckup from "@/models/RegularCheckup";
import "@/models/ServiceUsage";
import "@/models/Services";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const {doctor,hospitalCenterId,description,requestDate,selectedTimeSlot} = await req.json();
        const requestDateTime = requestDate+"T"+selectedTimeSlot
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== "patient"){
            return NextResponse.json({error: "Unauthorized"},{status: 401})
        }
        const user = await User.findOne({email: session.user.email})
        const profile = await PatientsProfile.findOne({patient: user._id})
        if(!profile){
            return NextResponse.json({error: "profile not found"},{status: 404})
        }
        const subscription = await Subscription.findOne({patient: user._id,endingDate: {$gt: Date.now()}})
        if(!subscription){
            return NextResponse.json({error: "You do not have an active CareBridge subscription"}, {status: 404})
        }
        const docAppointment = new DoctorAppointmentRequest({patient:profile._id,subscription: subscription._id,doctor,hospitalCenterId,description,requestDateTime})
        await docAppointment.save();
        return NextResponse.json({message: "successfully send the appointment request"},{status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}

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
        const regularCheckups = await RegularCheckup.find()
        .populate({path: "appointmentRequest" ,match: {patient: profile._id},populate: {path:"doctor", select: "fullName empId"}, select: "-patient -requestStatus -subscription"})
        .populate({path: "treatmentServices", populate: {path: "service",select: "-isActive"}})

        const filteredCheckups = regularCheckups.filter(r => r.appointmentRequest !== null);
        return NextResponse.json({
            message: "data fetched successfully",
            data: {
                regularCheckups: filteredCheckups
            }
        },{status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}


// sample responce 
// {
//     "appReq": [
//       {
//         "_id": "6641...",
//         "patient": "663f...",
//         "doctor": "663d...",
//         "hospitalCenterId": "carebridge-mumbai",
//         "description": "Back pain",
//         "requestStatus": "pending",
//         "requestDateTime": "2025-06-14T08:00:00.000Z"
//       }
//     ],
//     "regularCheckups": [
//       {
//         "_id": "6642...",
//         "appointmentRequest": {
//           "_id": "6641...",
//           "doctor": {
//             "_id": "663d...",
//             "fullName": "Dr. Anjali Roy",
//             "empId": "DOC1090"
//           },
//           "hospitalCenterId": "carebridge-mumbai",
//           "description": "Back pain",
//           "requestDateTime": "2025-06-14T08:00:00.000Z"
//         },
//         "treatmentServices": [
//           {
//             "_id": "6643...",
//             "service": {
//               "_id": "664s...",
//               "name": "X-Ray"
//             },
//             "unit": 1,
//             "totalCost": 700,
//             "note": "Lumbar scan",
//             "dateProvided": "2025-06-14T10:00:00.000Z",
//             "isProvided": "provided",
//             "isPaid": false
//           }
//         ],
//         "followUpDate": "2025-06-20",
//         "notes": "Take rest for 5 days",
//         "isDone": false
//       }
//     ]
//   }