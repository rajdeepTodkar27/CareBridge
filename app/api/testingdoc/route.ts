import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import ServiceUsage from "@/models/ServiceUsage";

export async function GET() {
  try {
    await connect();

    // ✅ Replace this with a real ObjectId from Services collection
    const hardcodedData = {
      service: "64e8bcca4a3c32d3b0123456", // sample service ObjectId
      unit: 2,
      totalCost: 500,
      note: "Test usage for diagnostics service",
      dateProvided: new Date("2025-07-15T10:30:00Z"),
      isProvided: "provided",
      isPaid: true
    };

    const newUsage = await ServiceUsage.create(hardcodedData);

    return NextResponse.json({ success: true, data: newUsage });
  } catch (error) {
    console.error("Failed to insert:", error);
    return NextResponse.json({ success: false, error: "Insert failed" }, { status: 500 });
  }
}
