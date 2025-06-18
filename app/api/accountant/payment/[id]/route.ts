import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import RegularCheckup from "@/models/RegularCheckup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AllCare from "@/models/AllCare";
import Payment from "@/models/Payment";
import ServiceUsage from "@/models/ServiceUsage";


// for the regular checkup parameter will be reg-id and for the admitted patient it will be adm-id

export async function GET({ params }: { params: { id: string } }) {
    try {
        await connect();

        const admissionId = params.id;
        const [st, id] = admissionId.split("-");

        if (!st || !id) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        if (st === "adm") {
            const hospitalA = await HospitalAdmissions.findById(id)
                .populate({ path: "patient", populate: { path: "patient", select: "email" }, select: "patient fullName mobileNo" })
                .populate({ path: "treatmentServices", populate: { path: "service", select: "serviceName baseCost" } })
                .select("patient datetimeOfAdmission treatmentServices")

            if (!hospitalA) {
                return NextResponse.json({ error: "data not found" }, { status: 404 })
            }

            return NextResponse.json({ message: "data fetched successfully", data: hospitalA }, { status: 200 })
        }
        if (st === "reg") {
            const regularC = await RegularCheckup.findById(id)
                .populate({ path: "appointmentRequest", populate: { path: "patient", populate: { path: "patient", select: "email" }, select: "patient fullName mobileNo" } })
                .populate({ path: "treatmentServices", populate: { path: "service", select: "serviceName baseCost" } })
                .select("appointmentRequest treatmentServices")

            if (!regularC) {
                return NextResponse.json({ error: "data not found" }, { status: 404 })
            }

            return NextResponse.json({ message: "data fetched successfully", data: regularC }, { status: 200 })
        }

        return NextResponse.json({ error: "Invalid ID prefix" }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        await connect()
        const { patient, date, service, paymentMethod, paymentId } = await req.json()
        if (!patient || !date || !service || !paymentMethod || !paymentId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "accountant") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const hospital = await AllCare.findOne({ centerId: session.user.centerId })
        if (!hospital) {
            return NextResponse.json({ error: "Not found the care centre" }, { status: 404 })
        }
        const payment = new Payment({ patient, hospital: hospital._id, date, service, paymentMethod, paymentId, subscription: null })
        await payment.save()

        await ServiceUsage.updateMany(
            { _id: { $in: service } },
            { $set: { isPaid: true } }
        );
        return NextResponse.json({ message: "successfully saved the payment information" }, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();
        const admissionId = params.id;
        const [st, id] = admissionId.split("-");
        const { isDone } = await req.json();

        if (st === "adm") {
            const admPatient = await HospitalAdmissions.findByIdAndUpdate(
                id,
                { $set: { isDischarged: isDone, dischargeDateTime: new Date() } },
                { new: true } 
            );
            if (!admPatient) {
                return NextResponse.json({ error: "Admission record not found" }, { status: 404 });
            }
            return NextResponse.json({ message: "Admission updated successfully"}, { status: 200 });
        }

        if (st === "reg") {
            const regPatient = await RegularCheckup.findByIdAndUpdate(
                id,
                { $set: { isDone } },
                { new: true }
            );
            if (!regPatient) {
                return NextResponse.json({ error: "Regular checkup record not found" }, { status: 404 });
            }
            return NextResponse.json({ message: "Regular checkup updated successfully" }, { status: 200 });
        }

        return NextResponse.json({ error: "Invalid ID prefix" }, { status: 400 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
