import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbconfig/dbconfig"
import AllCare from "@/models/AllCare";
import { error } from "console";

// post and put will be used by brachadmin


export async function POST(req: NextRequest) {
    try {
        await connect();
        const {branchId,centerId, name, type, address, city, state, email, phoneNo, latitude, longitude} = await req.json()

        const isBranchExist = await AllCare.findOne({centerId})

        if(isBranchExist){
            return NextResponse.json({error: "branch already exists"},{status: 400})
        }

        const allcare = new AllCare({branchId,centerId, name, type, address, city, state, email, phoneNo, latitude, longitude})

        await allcare.save()

        return NextResponse.json({message: "new branch of created successfully"},{status: 201})

    } catch (error) {
        console.log(error);        
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}

export async function GET() {
    try {
        await connect();
        const allHospitals = await AllCare.find().select("name branchId centerId type")
        if (allHospitals.length ===0) {
            return NextResponse.json({message: "No branches of hospital found"}, {status: 404})
        }

        return NextResponse.json({message: "hospital data received successfully", data: allHospitals},{status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }   
}

export async function PUT(req: NextRequest) {
    try {
        await connect();
        const {branchId,centerId, name, type, address, city, state, email, phoneNo, latitude, longitude} = await req.json()

        const allcare = await AllCare.findOneAndUpdate({centerId},{$set:{branchId, name, type, address, city, state, email, phoneNo, latitude, longitude}})

        if(!allcare){
            return NextResponse.json({error: "branch not exists"},{status: 404})
        }
        return NextResponse.json({message: "details updated successfully"},{status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}