import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import MedicationsRoutine from "@/models/MedicationsRoutine";
import { Types, Document } from "mongoose";


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


export async function GET({ params }: { params: { id: string } }) {
  try {
    await connect();
    const id = params.id;
    const today = new Date();

    const routines: IMedRoutine[] = await MedicationsRoutine.find({ 
      patient: id, 
      endingDate: { $gte: today.toISOString() } 
    });

    if (routines.length === 0) {
      return NextResponse.json({ error: "No Medication routine found" }, { status: 404 });
    }

    let allMedications: any[] = [];

    routines.forEach(routine => {
      routine.Medication.forEach(med => {
        allMedications.push({
          routineId: routine._id,  
          medicineName: med.medicineName,
          dosage: med.dosage,
          time: med.time,
          mealRelation: med.mealRelation,
          isTaken: med.isTaken
        });
      });
    });

    allMedications.sort((a, b) => a.time.localeCompare(b.time));

    return NextResponse.json({ medications: allMedications }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect()
    const { patientUid, Medication, startingDate, endingDate } = await req.json()
    const medicationRoutine = new MedicationsRoutine({
      patient: patientUid,
      Medication: Medication,
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    await connect();

    const { routineId, medicineName, time } = await req.json();

    if (!routineId || !medicineName || !time) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const result = await MedicationsRoutine.updateOne(
      {
        _id: routineId,
        "Medication.medicineName": medicineName,
        "Medication.time": time
      },
      {
        $set: { "Medication.$.isTaken": true }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Medication marked as taken." }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}