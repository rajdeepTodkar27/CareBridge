import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import ProfileDoctor from "@/models/ProfileDoctor";
import RegularCheckup from "@/models/RegularCheckup";

export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorize" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        const profile = await ProfileDoctor.findOne({ user: user._id })

        if (!profile) {
            return NextResponse.json({ error: "Not found Doctors profile" }, { status: 404 })
        }

        const regularcheckup = await RegularCheckup.find({ isDone: false })
            .populate({ path: "appointmentRequest", match: { doctor: profile._id }, populate: { path: "patient", select: "patient fullName gender" }, select: "description scheduledTime" })
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
//       "_id": "665f3b2de6f8721f4e9e72cb",
//       "appointmentRequest": {
//         "_id": "665f3a99e6f8721f4e9e72c9",
//         "description": "Follow-up for blood pressure check",
//         "patient": {
//           "_id": "665f3a12e6f8721f4e9e72c7",
//           "patient": "665f390ae6f8721f4e9e72c5",
//           "fullName": "Ravi Kumar",
//           "gender": "male",
//           "mobileNo": 9876543210
//         }
//       }
//     }
