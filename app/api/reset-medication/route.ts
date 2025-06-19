import { NextResponse } from "next/server";
import mongoose, { Types, Document } from 'mongoose';
import MedicationsRoutine from "@/models/MedicationsRoutine";
import MissedMedicationRoutine from "@/models/MissedMedicationRoutine";
import { connect } from "@/dbconfig/dbconfig";


interface Medicine {
  medicineName: string;
  dosage: string;
  time: string;
  mealRelation: 'before_meal' | 'after_meal';
  isTaken: boolean;
}


interface IMedRoutine extends Document {
  patient: Types.ObjectId;
  Medication: Medicine[];
  startingDate: string;
  endingDate: string;
}


interface MissedMedicine {
  medicineName: string;
  dosage: string;
  time: string;
  mealRelation: 'before_meal' | 'after_meal';
}


interface IMissedMedRoutine extends Document {
  patient: Types.ObjectId;
  Medication: MissedMedicine[];
  missedDate: string;
}


export async function GET() {
  try {
    await connect();

    const today = new Date();
    const todayISO = today.toISOString();

    const routines: IMedRoutine[] = await MedicationsRoutine.find({
      endingDate: { $gte: todayISO }
    });

    for (const routine of routines) {
      const missedMedications: MissedMedicine[] = routine.Medication
        .filter(med => !med.isTaken)
        .map(med => ({
          medicineName: med.medicineName,
          dosage: med.dosage, 
          time: med.time,
          mealRelation: med.mealRelation
        }));

      if (missedMedications.length > 0) {
        await MissedMedicationRoutine.create({
          patient: routine.patient,
          Medication: missedMedications,
          missedDate: today.toISOString().split('T')[0]
        });
      }

      routine.Medication.forEach(med => {
        med.isTaken = false;
      });

      await routine.save();
    }

    console.log('✅ Manual medication reset and missed routine save done.');
    return NextResponse.json({ message: 'Manual reset completed successfully.' });

  } catch (error) {
    console.error('❌ Error in manual medication reset:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
