import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import MedicineStock from "@/models/MedicineStock";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const centerId = session.user.centerId;

    const medicines = await MedicineStock.find({ medicineCentreId: centerId });

    return NextResponse.json({ success: true, data: medicines }, { status: 200 });

  } catch (error) {
    console.error("Error fetching medicine stock:", error);
    return NextResponse.json({ success: false, message: "Error fetching data" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const centerId = session.user.centerId;

    const { medicineName, brandName, sellingPrice, description, stock } = await req.json();

    // Validate inputs
    if (!medicineName || !brandName || sellingPrice === undefined || !Array.isArray(stock) || stock.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
    }

    // Validate stock items
    for (const batch of stock) {
      if (!batch.batchNumber || !batch.expiryDate || batch.quantity === undefined) {
        return NextResponse.json({ success: false, message: "Invalid stock batch data" }, { status: 400 });
      }
    }

    const newMedicine = await MedicineStock.create({
      medicineCentreId: centerId,
      medicineName,
      brandName,
      sellingPrice,
      description,
      stock
    });

    return NextResponse.json({ success: true, data: newMedicine }, { status: 201 });

  } catch (error) {
    console.error("Error adding medicine stock:", error);
    return NextResponse.json({ success: false, message: "Error adding medicine stock" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const centerId = session.user.centerId;

    const { medicineId, batchNumber, expiryDate, quantityToAdd } = await req.json();

    if (!medicineId || !batchNumber || !expiryDate || quantityToAdd === undefined) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Try to update if batch exists
    const updateResult = await MedicineStock.updateOne(
      { 
        _id: medicineId, 
        medicineCentreId: centerId, 
        "stock.batchNumber": batchNumber 
      },
      { 
        $inc: { "stock.$.quantity": quantityToAdd } 
      }
    );

    if (updateResult.modifiedCount > 0) {
      // Batch exists and updated successfully
      return NextResponse.json({ success: true, message: "Batch quantity updated successfully" }, { status: 200 });
    }

    // If batch does not exist, push new batch
    const pushResult = await MedicineStock.updateOne(
      { _id: medicineId, medicineCentreId: centerId },
      { 
        $push: { 
          stock: { 
            batchNumber, 
            expiryDate: new Date(expiryDate), 
            quantity: quantityToAdd 
          } 
        } 
      }
    );

    if (pushResult.modifiedCount > 0) {
      return NextResponse.json({ success: true, message: "New batch added successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Medicine not found for this center" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json({ success: false, message: "Error updating stock" }, { status: 500 });
  }
}
