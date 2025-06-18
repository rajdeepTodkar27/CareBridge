import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import MedicalHistory from "@/models/MedicalHistory";


// params id=admission._id


export async function GET({ params }: { params: { id: string } }) {
  try {
    await connect();

    const admissionId = params.id;

    const admission = await HospitalAdmissions.findById(admissionId)
      .populate({
        path: "patient",
        select: "fullName gender emergencyContact dateOfBirth aadharNo mobileNo patient",
        populate: {
            path: "patient",
            select: "email"
          },
      })
      .populate("treatmentServices")
      .populate({ path: "assignedNurse", select: "fullName mobileNo gender empId" })
      .populate({ path: "assignedDoctor", select: "fullName mobileNo gender medicalSpeciality empId" })


    if (!admission || !admission.patient) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    const patientUserId = admission.patient.patient;

  

    return NextResponse.json({
      message: "Successfully fetched data",
      data: {
        patient: {
          patientUId: patientUserId._id,
          email: patientUserId.email,
          fullName: admission.patient.fullName,
          gender: admission.patient.gender,
          dateOfBirth: admission.patient.dateOfBirth,
          aadharNo: admission.patient.aadharNo,
          emergencyContact: admission.patient.emergencyContact,
          mobileNo: admission.patient.mobileNo,
        },
        admissionDetails: {
          datetimeOfAdmission: admission.datetimeOfAdmission,
          bedNo: admission.bedNo,
          isDischarged: admission.isDischarged,
          dischargeDateTime: admission.dischargeDateTime,
          assignedNurse: admission.assignedNurse,
          assignedDoctor: admission.assignedDoctor,
          treatmentServices: admission.treatmentServices,
        },
      },
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
