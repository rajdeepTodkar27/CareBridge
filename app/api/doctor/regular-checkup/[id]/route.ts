import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import PatientsProfile from "@/models/PatientsProfile";
import RegularCheckup from "@/models/RegularCheckup";
import MedicalHistory from "@/models/MedicalHistory";
// on profile page will see medical history, give prescription, after appointment they will do done--> in regular check update true
// also putting the treatment services
// id is user._id


// params i.e id=regularcheckup._id


export async function GET({ params }: { params: { id: string } }) {
  try {
    await connect();

    const regularCheckupId = params.id;

    const regularCheckup = await RegularCheckup.findById(regularCheckupId)
      .populate({
        path: "appointmentRequest",
        populate: {
          path: "patient",
          select: "fullName gender lifestyle vitals mobileNo",
          populate: {
            path: "vitals",
          },
        },
      })
      .populate("treatmentServices");

    if (
      !regularCheckup ||
      !regularCheckup.appointmentRequest ||
      !regularCheckup.appointmentRequest.patient
    ) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    const patientUserId = regularCheckup.appointmentRequest.patient.patient;

    const medicalHistory = await MedicalHistory.findOne({ patient: patientUserId })
      .populate("pastPrescriptions");

    return NextResponse.json({
      message: "Successfully fetched data",
      data: {
        patient: {
          fullName: regularCheckup.appointmentRequest.patient.fullName,
          gender: regularCheckup.appointmentRequest.patient.gender,
          lifestyle: regularCheckup.appointmentRequest.patient.lifestyle,
          vitals: regularCheckup.appointmentRequest.patient.vitals,
          mobileNo: regularCheckup.appointmentRequest.patient.mobileNo,
        },
        regularCheckup: {
          followUpDate: regularCheckup.followUpDate,
          notes: regularCheckup.notes,
          isDone: regularCheckup.isDone,
          treatmentServices: regularCheckup.treatmentServices,
        },
        medicalHistory,
      },
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
    try {
        await connect()
        const {userId} = await req.json()

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})

    }
}