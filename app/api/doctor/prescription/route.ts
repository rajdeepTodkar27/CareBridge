import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Prescription from "@/models/Prescription";


// should i do medicine routine here somewhere else?

export async function POST(req: NextRequest) {
    try {
        await connect()
        const {patientUid, medicine}=await req.json()

        const todayDate = Date.now()
        const prescription = new Prescription({patient: patientUid, medicine,date: todayDate})
        await prescription.save()
        return NextResponse.json({message: "successfully saved the prescription"},{status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}



//sample request
// {
//   "patientUid": "665fc8013b6d2b92fce73515",
//   "medicine": [
//     {
//       "medName": "Paracetamol",
//       "quantity": "10 tablets",
//       "dosage": "1 tablet twice a day"
//     }
//   ]
// }
