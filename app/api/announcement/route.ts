import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/User";
import ProfileDoctor from "@/models/ProfileDoctor";
import ProfileStaff from "@/models/ProfileStaff";
import Announcement from "@/models/Announcement";
import ProfilePharmasist from "@/models/ProfilePharmasist";


export async function GET() {
    try {
        await connect();

        const announcements = await Announcement.find().sort({ timestamp: -1 }).populate({ path: "sendersProfileId", select: "fullName avtarImg" })

        return NextResponse.json({
            message: "successfully fetched the all the announcements",
            data: announcements,
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch announcements",
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    let profileId: string | null = null;
    let senderModel = "";

    if (user.role === "doctor") {
      const doctorProfile = await ProfileDoctor.findOne({ user: user._id }).select("_id");
      if (doctorProfile) {
        profileId = doctorProfile._id;
        senderModel = "ProfileDoctor";
      }
    } else if (user.role === "accountant" || user.role === "receptionist") {
      const staffProfile = await ProfileStaff.findOne({ user: user._id }).select("_id");
      if (staffProfile) {
        profileId = staffProfile._id;
        senderModel = "ProfileStaff";
      } 
    } else if (user.role === "pharmasist"){
      const pharmasistProfile = await ProfilePharmasist.findOne({user: user._id}).select("_id")
      if(pharmasistProfile){
        profileId+ pharmasistProfile._id
        senderModel = "ProfilePharmasist"
      }
    }


    if (!profileId || !senderModel) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    const { text, link } = await req.json();
    if (!text) {
      return NextResponse.json({ success: false, message: "Text is required" }, { status: 400 });
    }

    const newAnnouncement = await Announcement.create({
      sendersProfileId: profileId,
      senderModel,
      text,
      link,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Announcement created successfully"
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
