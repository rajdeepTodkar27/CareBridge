import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import RegularCheckup from "@/models/RegularCheckup";
import ServiceUsage from "@/models/ServiceUsage";
import "@/models/DoctorAppointmentRequest";
import "@/models/ProfileDoctor";
import "@/models/PatientsProfile";
// params i.e id=regularcheckup._id


export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
  try {
    await connect();

    const {id} = await  params;

    const regularCheckup = await RegularCheckup.findOne({appointmentRequest:id})
      .populate({
        path: "appointmentRequest",
        populate: [{
          path: "patient",
          select: "fullName avtarImg gender emergencyContact dateOfBirth aadharNo  mobileNo patient",
          populate: {
            path: "patient",
            select: "email"
          },
        },{path: "doctor", select: "fullName mobileNo gender medicalSpeciality empId"}]
      })
      .populate({path: "treatmentServices", populate: {path: "service", select: "serviceName"}, select:"service isPaid dateProvided isProvided totalCost"});

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

    const { appointmentRequest, service } = await req.json();
    console.log("Received service:", service);

    // Basic validation
    if (
      !appointmentRequest ||
      !service ||
      !service.serviceId ||
      !service.unit ||
      !service.totalCost ||
      !service.dateProvided
    ) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    const isServiceProvided = service.isProvided===true ? "provided" : "pending"
    // Create and save the new treatment service
    const newService = new ServiceUsage({
      service: service.serviceId,
      unit: service.unit,
      totalCost: service.totalCost,
      note: service.note || "",
      dateProvided: new Date(service.dateProvided),
      isProvided: isServiceProvided,
      isPaid: service.isPaid === true
    });

    await newService.save();

    // Update the regular checkup record
    const updatedCheckup = await RegularCheckup.findOneAndUpdate(
      {appointmentRequest},
      { $push: { treatmentServices: newService._id } },
      { new: true }
    );

    if (!updatedCheckup) {
      return NextResponse.json(
        { error: "Regular checkup not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Treatment service added successfully", updatedCheckup },
      { status: 200 }
    );

  } catch (error) {
    console.error("PUT /regular-checkup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    await connect();

    const { serviceId, updatedData } = await req.json();

    if (!serviceId || !updatedData) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    console.log(updatedData.dateProvided);
    
    const updatedService = await ServiceUsage.findByIdAndUpdate(
      serviceId,
      {
        $set: {
          ...updatedData,
          // unit: updatedData.unit,
          // totalCost: updatedData.totalCost,
          // note: updatedData.note || "",
          // dateProvided: new Date(updatedData.dateProvided),
          // isProvided: updatedData.isProvided,
          // isPaid: updatedData.isPaid,
        },
      },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service updated successfully", updatedService }, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const { appointmentRequest, serviceId } = await req.json();

    if (!appointmentRequest || !serviceId) {
      return NextResponse.json({ error: "Missing regularCheckupId or serviceId" }, { status: 400 });
    }

    // Remove service usage document
    const deleted = await ServiceUsage.findByIdAndDelete(serviceId);
    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Remove reference from RegularCheckup
    const updatedCheckup = await RegularCheckup.findOneAndUpdate(
      {appointmentRequest},
      { $pull: { treatmentServices: serviceId } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Service removed successfully", updatedCheckup },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing service:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}