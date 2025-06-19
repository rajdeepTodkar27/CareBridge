import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import MedicationsRoutine from "@/models/MedicationsRoutine";
import MissedMedicationRoutine from "@/models/MissedMedicationRoutine";

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const id = params.id;

    const medroutine = await MedicationsRoutine
      .findOne({ patient: id })
      .sort({ endingDate: -1 });

    if (!medroutine) {
      return NextResponse.json(
        { error: "Medication routine not found" }, 
        { status: 404 }
      );
    }

    const missedMedRoutine = await MissedMedicationRoutine.find({
      patient: id,
      missedDate: { $gt: medroutine.startingDate }
    });

    if (missedMedRoutine.length === 0) {
      return NextResponse.json(
        { message: "No missed medications found" }, 
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        message: "Successfully fetched missed medications", 
        data: missedMedRoutine 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}


