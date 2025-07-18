import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import MedicalHistory from "@/models/MedicalHistory";
import Vitals from "@/models/Vitals";


// params id=admission._id
// nurse can change vitals
// here should think and update the code for adding medication routine

export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
  try {
    await connect();

    const admissionId = params.id;

    const admission = await HospitalAdmissions.findById(admissionId)
      .populate({
        path: "patient",
        select: " fullName gender lifestyle vitals mobileNo patient",
        populate: { path: "vitals" },
      })
      .populate("treatmentServices")
      .populate({path:"assignedDoctor", select: "fullName empId"})

    if (!admission || !admission.patient) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    const patientUserId = admission.patient.patient;

    const medicalHistory = await MedicalHistory.findOne({ patient: patientUserId })
      .populate("pastPrescriptions");

    return NextResponse.json({
      message: "Successfully fetched data",
      data: {
        patient: {
          patientUId: patientUserId,
          fullName: admission.patient.fullName,
          gender: admission.patient.gender,
          lifestyle: admission.patient.lifestyle,
          vitals: admission.patient.vitals,
          mobileNo: admission.patient.mobileNo,
        },
        admissionDetails: {
          datetimeOfAdmission: admission.datetimeOfAdmission,
          bedNo: admission.bedNo,
          isDischarged: admission.isDischarged,
          dischargeDateTime: admission.dischargeDateTime,
          treatmentServices: admission.treatmentServices,
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
    await connect();
    const { patient, weight,height,bmi,heartRate,bloodSugar,bloodPressure,temperature} = await req.json()

    const updateVitals = await Vitals.findOneAndUpdate({patient: patient},{$set: {weight,height,bmi,heartRate,bloodSugar,bloodPressure,temperature}},{ upsert: true, new: true })

    return NextResponse.json({message: "Patients vitals updated successfully",data: updateVitals},{status: 200})
  } catch (error) {
    console.log(error);
    return NextResponse.json({error: "Internal server error"},{status: 500})
  }
}