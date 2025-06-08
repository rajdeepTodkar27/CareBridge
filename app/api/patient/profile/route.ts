import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";


export async function GET(req: NextRequest) {
    try {
        await connect();
        return NextResponse.json({message:"successfully",data: undefined})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}

export async function Post(req: NextRequest) {
    try {
        await connect();
        return NextResponse.json({message:"successfully",data: undefined})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}