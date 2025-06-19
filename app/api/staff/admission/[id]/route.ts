import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import ServiceUsage from "@/models/ServiceUsage";

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