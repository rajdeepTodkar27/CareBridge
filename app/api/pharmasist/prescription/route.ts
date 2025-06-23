import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/User";

export async function GET() {
    try {
        await connect()
        const user = await User.find({role: "patient"})
        if(user.length === 0 ){
            return NextResponse.json({error: "patients not found"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched data",data: user},{status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}