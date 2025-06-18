import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AllCare from "@/models/AllCare";
import { error } from "console";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/User";
import PatientsProfile from "@/models/PatientsProfile";
import HospitalAdmissions from "@/models/HospitalAdmissions";


export async function POST(req: NextRequest) {
    try {
        await connect()
        const {patientEmail,datetimeOfAdmission,bedNo, assignedDoctor,assignedNurse,hospitalCenterId} = await req.json()

        const user = await User.findOne({email: patientEmail})
        if(!user){
            return NextResponse.json({error: "Patients user id not found"},{status: 404})
        }
        const patient = await PatientsProfile.findOne({user: user._id})
        if(!patient){
            return NextResponse.json({error: "Patients user id not found"},{status: 404})
        }
        const addmission = new HospitalAdmissions({patient: patient._id,datetimeOfAdmission,bedNo,assignedDoctor,assignedNurse,hospitalCenterId, treatmentServices: []})
        await addmission.save()
        return NextResponse.json({message: "patient admitted successfully"},{status: 201})
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
        const addmission = await HospitalAdmissions.find({hospitalCenterId: centerId, isDischarged: false})
        .populate({path: "patient",select: "patient fullName gender "})
        .select("patient bedNo")

        if(!addmission){
            return NextResponse.json({error: "no data found"},{status: 404})
        }
        
        return NextResponse.json({message: "successfully fetched admission data ",data: addmission},{status: 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}