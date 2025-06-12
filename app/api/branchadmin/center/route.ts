import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AllCare from "@/models/AllCare";
import { error } from "console";
import { connect } from "@/dbconfig/dbconfig";

// for the branchadmin centerId is branchId for the others it is a centerId

// post and put info of the carecenter  admin routes are used  createstff and staffinfo of admin

export async function GET() {
    try {
        await connect();
        const session = await getServerSession(authOptions)
        if (!session || session.user?.role !== "branchadmin") {
            return NextResponse.json({error: "Unauthorized"}, { status: 401 });
        }

        const branchAdmincenterId = session.user.centerId;
        const centers = await AllCare.find({ branchId: branchAdmincenterId })
        if (centers.length === 0) {
            return NextResponse.json({ error: "no center available" }, { status: 404 })
        }

        return NextResponse.json({ message: "centers data fetched successfully" }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {

}