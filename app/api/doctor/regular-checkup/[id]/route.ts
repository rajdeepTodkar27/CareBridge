import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import PatientsProfile from "@/models/PatientsProfile";
import RegularCheckup from "@/models/RegularCheckup";
import MedicalHistory from "@/models/MedicalHistory";
import Vitals from "@/models/Vitals";
import  "@/models/ServiceUsage";
import "@/models/DoctorAppointmentRequest";
// on profile page will see medical history, give prescription, after appointment they will do done--> in regular check update true
// also putting the treatment services
// id is user._id


// params i.e id=regularcheckup._id


export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
  try {
    await connect();

    const {id} = await params;

    const regularCheckup = await RegularCheckup.findOne({appointmentRequest: id})
      .populate({
        path: "appointmentRequest",
        populate: {
          path: "patient",
          select: "fullName gender lifestyle vitals mobileNo patient",
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

    

    return NextResponse.json({
      message: "Successfully fetched data",
      data: {
        patient: {
          patientUId: patientUserId,
          profileId: regularCheckup.appointmentRequest.patient._id,
          fullName: regularCheckup.appointmentRequest.patient.fullName,
          dateOfBirth: regularCheckup.appointmentRequest.patient.dateOfBirth,
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
        }
      },
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



export async function POST(req: NextRequest) {
  try {
    await connect();

    const { patientUid, vitals } = await req.json();

    if (!patientUid || !vitals) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const updatedVitals = await Vitals.findOneAndUpdate(
      { patient: patientUid },
      { ...vitals, patient: patientUid },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Vitals updated successfully", data: updatedVitals },
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

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const { appointmentRequest, followUpDate, notes } = await req.json();
    console.log(appointmentRequest);
    
    if (!appointmentRequest) {
      return NextResponse.json({ error: "Missing checkup ID" }, { status: 400 });
    }

    const updatedCheckup = await RegularCheckup.findOneAndUpdate(
      {appointmentRequest},
      {
        $set: {
          followUpDate,
          notes,
        },
      },
      { new: true }
    );

    if (!updatedCheckup) {
      return NextResponse.json({ error: "Checkup not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Checkup updated successfully", data: updatedCheckup },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating checkup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}