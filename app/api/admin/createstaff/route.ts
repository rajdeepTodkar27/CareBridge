import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbconfig/dbconfig"
import AllCare from "@/models/AllCare";
import { error } from "console";
import User from "@/models/User";
import bcrypt from 'bcrypt'

// branchadmin will also use this route
// this route is also used by branchAdmin so he can create staff but he can only able to create staff for his branch usesession will give the branchId



export async function POST(req: NextRequest) {
    try {
        await connect();
        const {email,password,role,centerId}= await req.json()
        const isexists = await User.findOne({email: email})
        if(isexists){
            return NextResponse.json({error: "user already exists"},{status: 400})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({email: email,password:hashedPassword, role:role,centerId:centerId})
        await user.save()
        return NextResponse.json({message: "user created successfully"},{status: 201})
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}


