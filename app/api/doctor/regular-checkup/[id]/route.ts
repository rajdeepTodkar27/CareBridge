import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import PatientsProfile from "@/models/PatientsProfile";
import RegularCheckup from "@/models/RegularCheckup";
import MedicalHistory from "@/models/MedicalHistory";
import Vitals from "@/models/Vitals";
import ServiceUsage from "@/models/ServiceUsage";
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

    const medicalHistory = await MedicalHistory.findOne({ patient: patientUserId })
      .populate("pastPrescriptions");

    return NextResponse.json({
      message: "Successfully fetched data",
      data: {
        patient: {
          patientUId: patientUserId,
          profileId: regularCheckup.appointmentRequest.patient._id,
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

    const { regularCheckupId, treatmentServices } = await req.json();

    if (!regularCheckupId || !Array.isArray(treatmentServices) || treatmentServices.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const createdServices = await Promise.all(
      treatmentServices.map(async (service: any) => {
        const newService = new ServiceUsage({
          service: service.serviceId,
          unit: service.unit,
          totalCost: service.totalCost,
          note: service.note || "",
          dateProvided: new Date(service.dateProvided),
          isProvided: service.isProvided,
          isPaid: service.isPaid
        });
        await newService.save();
        return newService._id;
      })
    );

    const admissionUpdate = await RegularCheckup.findByIdAndUpdate(
      regularCheckupId,
      { $push: { treatmentServices: { $each: createdServices } } },
      { new: true }
    );

    if (!admissionUpdate) {
      return NextResponse.json(
        { error: "Active hospital admission not found for this patient" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Treatment services added successfully" },
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
