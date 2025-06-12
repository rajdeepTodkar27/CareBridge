import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import MedicalHistory from "@/models/MedicalHistory";


// params id=admission._id

// doctor can edit his vitals, treatment services, 
export async function GET({ params }: { params: { id: string } }) {
  try {
    await connect();

    const admissionId = params.id;

    const admission = await HospitalAdmissions.findById(admissionId)
      .populate({
        path: "patient",
        select: "fullName gender lifestyle vitals mobileNo",
        populate: { path: "vitals" },
      })
      .populate("treatmentServices")
      .populate({ path: "assignedNurse", select: "fullName empId" });

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
          assignedNurse: admission.assignedNurse,
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
