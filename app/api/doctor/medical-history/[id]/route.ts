import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import MedicalHistory from "@/models/MedicalHistory";
import "@/models/Prescription";

export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
    await connect
    
    try {
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

export async function PUT(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();
    const { patientId, newTest } = body;

    if (!patientId || !newTest) {
      return NextResponse.json({ error: "Missing patientId or newTest" }, { status: 400 });
    }

    const updated = await MedicalHistory.findOneAndUpdate(
      { patient: patientId },
      { $push: { pastMedicalTests: newTest } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Medical history not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Test added", data: updated });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();
    const { patientId, testToRemove } = body;

    if (!patientId || !testToRemove) {
      return NextResponse.json({ error: "Missing patientId or testToRemove" }, { status: 400 });
    }

    const updated = await MedicalHistory.findOneAndUpdate(
      { patient: patientId },
      { $pull: { pastMedicalTests: { testfile: testToRemove.testfile } } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Medical history not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Test removed", data: updated });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}




export async function POST(req: NextRequest) {
  await connect();

  try {
    const { patientId, nameOfSurgery, dateOfSurgery, reportFile } = await req.json();

    if (!patientId || !nameOfSurgery || !dateOfSurgery || !reportFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSurgery = { nameOfSurgery, dateOfSurgery, reportFile };

    const updated = await MedicalHistory.findOneAndUpdate(
      { patient: patientId },
      { $push: { surgeries: newSurgery } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Surgery added successfully", data: updated }, { status: 200 });
  } catch (error) {
    console.error("Error adding surgery:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const { patientId, surgeryToRemove } = body;

    if (!patientId || !surgeryToRemove?.nameOfSurgery || !surgeryToRemove?.dateOfSurgery) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const result = await MedicalHistory.updateOne(
      { patient: patientId },
      {
        $pull: {
          surgeries: {
            nameOfSurgery: surgeryToRemove.nameOfSurgery,
            dateOfSurgery: surgeryToRemove.dateOfSurgery,
            reportFile: surgeryToRemove.reportFile
          }
        }
      }
    );

    return NextResponse.json({ message: "Surgery deleted", result });
  } catch (err) {
    console.error("Error deleting surgery:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}