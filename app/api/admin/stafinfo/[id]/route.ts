import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/User"
import { connect } from "@/dbconfig/dbconfig";

// branchadmin will use this route also
// this will get req from /admin/branches/centerId and from the params according to branch they will get data


export async function GET({ params }: { params: { id: string } }) {
    try {
        await connect();
        const { id } = params;

        const staff = await User.find({ centerId: id })
        if (staff.length === 0) {
            return NextResponse.json({ error: "no data found" }, { status: 400 })
        }
        return NextResponse.json({ message: "data successfully fetched", data: staff }, { status: 200 })
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connect();
        const { id,role,email,centerId, isActive } = await req.json()

        const user = await User.findByIdAndUpdate(id, { $set: { role,email,centerId,isActive } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: "user updated successfully" }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error " }, { status: 500 })
    }
}
