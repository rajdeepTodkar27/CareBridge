import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import PatientsProfile from "@/models/PatientsProfile";
import User from "@/models/User";
import DoctorAppointmentRequest from "@/models/DoctorAppointmentRequest";
import Subscription from "@/models/Subscription";
import RegularCheckup from "@/models/RegularCheckup";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        await connect();
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "patient") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        const profile = await PatientsProfile.findOne({ patient: user._id })
        if (!profile) {
            return NextResponse.json({ error: "profile not found" }, { status: 404 })
        }

        const recentAppointment = await DoctorAppointmentRequest
            .findOne({ patient: profile._id })
            .sort({ requestDateTime: -1 })
            .populate({ path: "doctor", select: "fullName empId" })
            // .populate({ path: "subscription", select: "endingDate" })
            .select("-patient");

        if (!recentAppointment) {
            return NextResponse.json({ error: "No appointment request found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Successfully fetched the recent appointment request",
            data: recentAppointment
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}