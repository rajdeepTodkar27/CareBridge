import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import AllCare from "@/models/AllCare";

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
        const carecenter = await AllCare.find({branchId})
        if(carecenter.length ===0){
            return NextResponse.json({error: "not found carecenters"},{status: 404})
        }
        return NextResponse.json({message: "fetched the data",data: carecenter},{status:200})
    } catch (error) {
        console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}