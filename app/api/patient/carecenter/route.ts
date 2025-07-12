import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import AllCare from "@/models/AllCare";
import ProfileDoctor from "@/models/ProfileDoctor";

export async function GET() {
  try {
    await connect();

    const branchIds = await AllCare.distinct("branchId");
    if(branchIds.length===0) {
        return NextResponse.json({error: "not found branchIds" },{status:404 })
    }
    return NextResponse.json({ message: "fetched the data",data:branchIds }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch branchIds:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    try {
        await connect()
        const {branchId} = await req.json();
        const carecenter = await AllCare.find({branchId}).select("type name branchId centerId")
        if(carecenter.length ===0){
            return NextResponse.json({error: "not found carecenters"},{status: 404})
        }
        return NextResponse.json({message: "fetched the data",data: carecenter},{status:200})
    } catch (error) {
        console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    const { centerId } = body;

    if (!centerId) {
      return NextResponse.json(
        { error: "centerId is required in the request body" },
        { status: 400 }
      );
    }

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
      { $match: { "user.centerId": centerId } },
      {
        $project: {
          fullName: 1,
          gender: 1,
          medicalSpeciality: 1,
        },
      },
    ]);

    return NextResponse.json(
      {
        message: "Doctors successfully fetched",
        data: doctors
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}