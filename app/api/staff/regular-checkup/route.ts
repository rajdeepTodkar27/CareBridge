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

        if (!session || session.user.role !== "staff") {
            return NextResponse.json({ error: "Unauthorize" }, { status: 401 })
        }
        const centerId = session.user.centerId
        
        const regularcheckup = await RegularCheckup.find({ isDone: false })
            .populate({ path: "appointmentRequest", match: { hospitalCenterId: centerId}, populate: { path: "patient", select: "patient fullName gender" }, select: "description scheduledTime" })
            .select("appointmentRequest")

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
