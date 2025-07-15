import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import MedicalHistory from "@/models/MedicalHistory";
import "@/models/Prescription";
import { error } from "console";
export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
    try {
        await connect;
        const {id} = await params;
        const medicalHistory = await MedicalHistory.findOne({ patient: id })
      .populate("pastPrescriptions");
      if(!medicalHistory){
        return NextResponse.json({error: "medical history not found"},{status: 404})
      }
      return NextResponse.json({message: "medical history fetched successfully",data: medicalHistory},{status: 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
           
    }
}