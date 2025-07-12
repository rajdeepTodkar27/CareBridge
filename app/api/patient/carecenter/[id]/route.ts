import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbconfig/dbconfig";
import AllCare from "@/models/AllCare";
import User from "@/models/User";
import ProfileDoctor from "@/models/ProfileDoctor";
import ProfileStaff from "@/models/ProfileStaff";
import Services from "@/models/Services";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const { id } = params;

    // Get the center info
    const allCenter = await AllCare.findOne({ centerId: id });

    
    const doctors = await ProfileDoctor.aggregate([
      {
        $lookup: {
          from: "users", 
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.centerId": id } },
      {
        $project: {
          fullName: 1,
          avtarImg: 1,
          gender: 1,
          medicalSpeciality: 1,
          experience: 1,
          administrativeTitle: 1,
          licenseNo: 1,
          licenseAuthority: 1,
        },
      },
    ]);


    const nurses = await ProfileStaff.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.centerId": id, "user.role": "nurse" } },
      {
        $project: {
          fullName: 1,
          avtarImg: 1,
          gender: 1,
          qualification: 1,
          institute: 1,
          administrativeTitle: 1,
        },
      },
    ]);

    const activeServices = await Services.find({
      centerId: id,
      isActive: true,
    });


    // if (doctors.length === 0 && nurses.length === 0) {
    //   return NextResponse.json(
    //     { error: "No doctors or nurses found for this center" },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json(
      {
        message: "Data successfully fetched",
        data: {
          allCenter,
          doctors,
          nurses,
          activeServices
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Aggregation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
