import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import PatientsProfile from "@/models/PatientsProfile";
import User from "@/models/User";



export async function GET() {
    try {
        await connect();
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "patient") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 404 })
        }
        const profile = await PatientsProfile.findOne({ patient: user._id })
        if (!profile) {
            return NextResponse.json({ error: "profile not found" }, { status: 404 })
        }

        const admission = await HospitalAdmissions.findOne({ patient: profile._id, isDischarged: false })
            .populate({
                path: "patient",
                select: "fullName",
                populate: { path: "vitals" },
            })
            .populate("treatmentServices")
            .populate({ path: "assignedNurse", select: "fullName  gender qualification institute empId" })
            .populate({ path: "assignedDoctor", select: "fullName  gender medicalSpeciality experience licenseNo licenseAuthority empId" })

        if (!admission || !admission.patient) {
            return NextResponse.json({ error: "Data not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Successfully fetched data",
            data: {
                patient: {
                    fullName: admission.patient.fullName,
                    vitals: admission.patient.vitals,
                },
                admissionDetails: {
                    datetimeOfAdmission: admission.datetimeOfAdmission,
                    bedNo: admission.bedNo,
                    isDischarged: admission.isDischarged,
                    dischargeDateTime: admission.dischargeDateTime,
                    assignedNurse: admission.assignedNurse,
                    assignedDoctor: admission.assignedDoctor,
                    treatmentServices: admission.treatmentServices,
                }
            },
        }, { status: 200 });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
