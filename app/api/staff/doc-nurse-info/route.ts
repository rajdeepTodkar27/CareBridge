import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import ProfileDoctor from "@/models/ProfileDoctor";
import User from "@/models/User";
import ProfileStaff from "@/models/ProfileStaff";


export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)
        if (!session || session.user.role != "staff") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const doctors = await User.find({ centerId: session.user.centerId, role: "doctor" }).select("_id")
        const nurse = await User.find({ centerId: session.user.centerId, role: "nurse" }).select("_id")
        const doctorIds = doctors.map(doc => doc._id);
        const nurseIds = nurse.map(n => n._id);

        const doctorsProfiles = await ProfileDoctor.find({ user: { $in: doctorIds } }).populate({ path: "user", select: "email -_id" }).select("fullName empId medicalSpeciality mobileNo")
        const nursesProfiles = await ProfileStaff.find({ user: { $in: nurseIds } }).populate({ path: "user", select: "email -_id" })

        return NextResponse.json({ message: "successfully fetched profiles", data: { doctorsProfiles, nursesProfiles } }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}