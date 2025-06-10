import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import ProfileDoctor from "@/models/ProfileDoctor";
import User from "@/models/User";

export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)
        if (!session || session.user.role != "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const profile = await ProfileDoctor.findOne({ user: user._id }).populate({ path: "user", select: "email -_id" })
        if (!profile) {
            return NextResponse.json({ error: "profile not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "successfully fetched the profile", data: profile }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

