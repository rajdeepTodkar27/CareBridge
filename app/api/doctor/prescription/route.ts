
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Prescription from "@/models/Prescription";
import MedicalHistory from "@/models/MedicalHistory";
import MedicationRoutine from "@/models/MedicationsRoutine";

export async function POST(req: NextRequest) {
    try {
        await connect();

        const { patientUid, medicine, startingDate, endingDate } = await req.json();

        const todayDate = new Date();
        const medicationRoutineArray = medicine.map((med: any) => ({
            medicineName: med.medName,
            dosage: med.dosage,
            time: med.time,
            mealRelation: med.mealRelation,
            isTaken: false
        }));
        const medicinePresc = medicine.map((med: any) => ({
            medName: med.medName,
            quantity: med.quantity,
            dosage: med.dosage,
        }));
      
        const prescription = new Prescription({
            patient: patientUid,
            medicine: medicinePresc,  
            date: todayDate
        });

        await prescription.save();

      
        await MedicalHistory.findOneAndUpdate(
            { patient: patientUid },
            { $push: { pastPrescriptions: prescription._id } },
            { upsert: true, new: true }
        );

        

        const medicationRoutine = new MedicationRoutine({
            patient: patientUid,
            Medication: medicationRoutineArray,
            startingDate: startingDate,   
            endingDate: endingDate        
        });

        await medicationRoutine.save();

        return NextResponse.json(
            { message: "Successfully saved prescription and medication routine" },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// export async function POST(req: NextRequest) {
//     try {
//         await connect()
//         const {patientUid, medicine}=await req.json()

//         const todayDate = Date.now()
//         const prescription = new Prescription({patient: patientUid, medicine,date: todayDate})
//         await prescription.save()
        
//         const medHis = await MedicalHistory.findOneAndUpdate({patient: patientUid},{$push: {pastPrescriptions: prescription._id}}, { upsert: true, new: true }) 
        
//         return NextResponse.json({message: "successfully saved the prescription"},{status: 201})
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({error: "Internal server error"},{status: 500})
//     }
// }   


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