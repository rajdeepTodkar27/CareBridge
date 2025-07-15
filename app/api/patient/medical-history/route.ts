import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import MedicalHistory from "@/models/MedicalHistory";
import Prescription from "@/models/Prescription";


export async function POST(req: NextRequest) {
    try {
        await connect()
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== "patient"){
            return NextResponse.json({error: "Unauthorized"},{status: 401})
        }
        const {pastIllness,currentMedications,allergies,geneticDisorders}=await req.json()
        const email = session.user.email
        const user = await User.findOne({email})
        const prescription = await Prescription.find({patient: user._id}).distinct('_id')     // distinct gives only array of _id not object if we use select it gives object like {_id:55115}
        const medHis = await MedicalHistory.findOne({patient: user._id}) 
        if(medHis){
            await MedicalHistory.findOneAndUpdate(medHis._id,{$set:{pastIllness,currentMedications,allergies,geneticDisorders,pastPrescriptions: prescription}})
            return NextResponse.json({message: "successfully update the medical history"},{status: 200})
        }
        const patientMedHis = new MedicalHistory({patient:user._id,pastIllness,surgeries:[],currentMedications,allergies,geneticDisorders,pastMedicalTests:[],pastPrescriptions: prescription})
        await patientMedHis.save()
        return NextResponse.json({message: "successfully create medical history"},{status:201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}

export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== "patient"){
            return NextResponse.json({error: "Unauthorized"},{status: 401})
        }
        const email = session.user.email
        const user = await User.findOne({email})
        const medHis = await MedicalHistory.findOne({patient: user._id})
        .populate({path:"pastPrescriptions"})
        .select("-patient")
        if(!medHis){
            return NextResponse.json({error: "Not found medical history"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched medical history of the patient", data:medHis},{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}