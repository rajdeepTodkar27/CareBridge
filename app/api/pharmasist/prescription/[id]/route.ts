import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Prescription from "@/models/Prescription";
import MedicationsRoutine from "@/models/MedicationsRoutine";


// id is user _id

export async function GET({ params }: { params: { id: string } }) {
    try {
        await connect()
        const uid = params.id

        const prescriptions = await Prescription.find({patient: uid}).sort({date: -1})
        const medRoutine = await MedicationsRoutine.find({patient: uid}).sort({startingDate: -1})

        return NextResponse.json({message: "successfully fetched the data",  
            data: {
                prescriptions,
                medRoutine
            }
        },)
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}