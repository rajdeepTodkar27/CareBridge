import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import RegularCheckup from "@/models/RegularCheckup";
import ServiceUsage from "@/models/ServiceUsage";
// params i.e id=regularcheckup._id


export async function GET({ params }: { params: { id: string } }) {
  try {
    await connect();

    const regularCheckupId = params.id;

    const regularCheckup = await RegularCheckup.findById(regularCheckupId)
      .populate({
        path: "appointmentRequest",
        populate: [{
          path: "patient",
          select: "fullName gender emergencyContact dateOfBirth aadharNo  mobileNo patient",
          populate: {
            path: "patient",
            select: "email"
          },
        },{path: "doctor", select: "fullName mobileNo gender medicalSpeciality empId"}]
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
          patientUId: patientUserId._id,
          fullName: regularCheckup.appointmentRequest.patient.fullName,
          gender: regularCheckup.appointmentRequest.patient.gender,
          email: patientUserId.email,
          aadharNo: regularCheckup.appointmentRequest.patient.aadharNo,
          dateOfBirth: regularCheckup.appointmentRequest.patient.dateOfBirth,
          mobileNo: regularCheckup.appointmentRequest.patient.mobileNo,
          emergencyContact: regularCheckup.appointmentRequest.patient.emergencyContact,
        },
        regularCheckup: {
          doctor: regularCheckup.appointmentRequest.doctor,
          followUpDate: regularCheckup.followUpDate,
          notes: regularCheckup.notes,
          isDone: regularCheckup.isDone,
          treatmentServices: regularCheckup.treatmentServices,
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