import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import MedicalHistory from "@/models/MedicalHistory";
import Vitals from "@/models/Vitals";


// params id=admission._id
// nurse can change vitals
// here should think and update the code for adding medication routine

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();

        const { id } =await  params;
        console.log(id);
        
        const vital = await Vitals.findOne({ patient: id })
        if (!vital) {
            return NextResponse.json({ message: "vitals not found" },{status: 404})
        }
        return NextResponse.json({ message: "patients vitals found successfully", data: vital },{status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

