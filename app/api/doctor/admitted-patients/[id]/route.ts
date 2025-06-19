import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import MedicalHistory from "@/models/MedicalHistory";
import ServiceUsage from "@/models/ServiceUsage";
import Vitals from "@/models/Vitals";
// params id=admission._id

// doctor can edit his vitals, treatment services, 
export async function GET({ params }: { params: { id: string } }) {
  try {
    await connect();

    const admissionId = params.id;

    const admission = await HospitalAdmissions.findById(admissionId)
      .populate({
        path: "patient",
        select: "fullName gender lifestyle vitals mobileNo patient",
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
          patientUId: patientUserId,
          profileId: admission.patient._id,
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

    const { profileId, treatmentServices } = await req.json();

    if (!profileId || !Array.isArray(treatmentServices) || treatmentServices.length === 0) {
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

    const admissionUpdate = await HospitalAdmissions.findOneAndUpdate(
      { patient: profileId, isDischarged: false },
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


// sample request
// {
//   "profileId": "60fe0bd123profile...",
//   "treatmentServices": [
//     {
//       "serviceId": "60fe0bd123service1",
//       "unit": 2,
//       "totalCost": 500,
//       "note": "Physiotherapy",
//       "dateProvided": "2025-06-19",
//       "isProvided": "pending",
//       "isPaid": false
//     },
//     {
//       "serviceId": "60fe0bd123service2",
//       "unit": 1,
//       "totalCost": 300,
//       "note": "Blood test",
//       "dateProvided": "2025-06-20",
//       "isProvided": "provided",
//       "isPaid": true
//     }
//   ]
// }
