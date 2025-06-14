import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import { Counter } from "@/models/Counter";
import ProfileStaff from "@/models/ProfileStaff";

export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const profile = await ProfileStaff.findOne({ user: user._id }).populate({ path: "user", select: "email -_id" })
        if (!profile) {
            return NextResponse.json({ error: "profile not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "successfully fetched the profile", data: profile }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


export async function POST(req: NextRequest) {
    try {
        await connect()
        const {fullName,mobileNo, gender, qualification,institute} =await req.json()
        const session = await getServerSession(authOptions)
        if (!session ) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isProfileExists = await ProfileStaff.findOne({user: user._id})
        if(isProfileExists){
            await ProfileStaff.findByIdAndUpdate(isProfileExists._id,{$set: {fullName,mobileNo, gender,qualification,institute}})
            return NextResponse.json({message: "successfully updated the profile"},{status: 200})
        }
        let staffConst = await Counter.findOneAndUpdate({centerId:user.centerId},{$inc: {count:1}},{new: true,upsert: true})
        let role=""
        if(user.role==="nurse"){role="NR"}else if(user.role==="staff"){role="ST"}else if(user.role==="accountant"){role="ACC"}
        const empId=`${user.centerId}-${role}-${staffConst.count.toString().padStart(4, "0")}`
        const profile = new ProfileStaff({user: user._id,empId,fullName,mobileNo, gender,qualification,institute})
        await profile.save()
        return NextResponse.json({message: "successfully created the profile"},{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}