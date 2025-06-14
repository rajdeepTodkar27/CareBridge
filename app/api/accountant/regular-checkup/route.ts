import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import ProfileStaff from "@/models/ProfileStaff";
import RegularCheckup from "@/models/RegularCheckup";

export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "accountant") {
            return NextResponse.json({ error: "Unauthorize" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        const profile = await ProfileStaff.findOne({ user: user._id })

        if (!profile) {
            return NextResponse.json({ error: "Not found Accountant profile" }, { status: 404 })
        }
        const regularcheckup = await RegularCheckup.find({ isDone: false })
            .populate({ path: "appointmentRequest", match: { hospitalCenterId: session.user.centerId }, populate: { path: "patient", select: "patient fullName gender" }, select: "description scheduledTime" })
            .select("appointmentRequest")

        // just regular checkup gives array of null doc if match fails
        const filteredCheckups = regularcheckup.filter(item => item.appointmentRequest !== null);

        if (filteredCheckups.length === 0) {
            return NextResponse.json({ error: "Not found regular checkups" }, { status: 404 });
        }
        return NextResponse.json({ message: "successfully fetched the data", data: filteredCheckups }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


// sample responce
    // {
    //   "_id": "665febb21f9a128fd9e01234",
    //   "appointmentRequest": {
    //     "_id": "665feb121f9a128fd9e04567",
    //     "description": "Follow-up for blood pressure",
    //     "scheduledTime": "2025-06-15T09:00:00.000Z",
    //     "patient": {
    //       "_id": "665faa001f9a128fd9e07890",
    //       "patient": "P2001",
    //       "fullName": "Ramesh Mehta",
    //       "gender": "Male"
    //     }
    //   }
    // },