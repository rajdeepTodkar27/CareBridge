import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import ProfileDoctor from "@/models/ProfileDoctor";
import User from "@/models/User";
import { Counter } from "@/models/Counter";

export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "doctor") {
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


export async function POST(req: NextRequest) {
    try {
        await connect()
        const {fullName,mobileNo, gender,medicalSpeciality,experience, licenseNo,licenseAuthority} =await req.json()
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isProfileExists = await ProfileDoctor.findOne({user: user._id})
        if(isProfileExists){
            await ProfileDoctor.findByIdAndUpdate(isProfileExists._id,{$set: {fullName,mobileNo, gender,medicalSpeciality,experience, licenseNo,licenseAuthority}})
            return NextResponse.json({message: "successfully updated the profile"},{status: 200})
        }
        let docConst = await Counter.findOneAndUpdate({centerId:user.centerId},{$inc: {count:1}},{new: true,upsert: true})
        const empId=`${user.centerId}-DR-${docConst.count.toString().padStart(4, "0")}`
        const profile = new ProfileDoctor({user: user._id,empId,fullName,mobileNo, gender,medicalSpeciality,experience, licenseNo,licenseAuthority})
        await profile.save()
        return NextResponse.json({message: "successfully created the profile"},{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}