import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbconfig/dbconfig"
import SubscriptionPlans from "@/models/SubscriptionPlans";



export async function GET() {
   try {
       await connect();
       const plans = await SubscriptionPlans.find({isActive: true})
       if(plans.length > 0){
        return NextResponse.json({message: "successfully got the plans data",data: plans},{status:200},)
       }

       return NextResponse.json({message: "No plans available"}, {status: 404})
   } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
   }
}

export async function POST(req: NextRequest) {
    try {
        await connect();
        const {  planName, description ,billingCycle,pharmacyDiscount,freeConsultions,price} = await req.json()
       
        
        const planexist = await SubscriptionPlans.find({planName: planName, billingCycle:billingCycle,isActive: true})
        if(planexist.length > 0){
            console.log("old plans are deactivated");
            
            await SubscriptionPlans.updateMany({planName: planName, billingCycle:billingCycle},{$set: {isActive: false}})
        }
        const plan = new SubscriptionPlans({planName, description ,billingCycle,pharmacyDiscount,freeConsultions,price})
        plan.save()

        return NextResponse.json({message: "plan created successfully"},{status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
        
    }
    
}

export async function PUT(req: NextRequest) {
    try {
        await connect();
        const {_id,isActive}= await req.json()
        

        const plan = await SubscriptionPlans.findOneAndUpdate({_id:_id},{$set: {isActive: isActive}})

        return NextResponse.json({message: " successfully updated the plan"},{status: 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal Server error"},{status: 500})
        
    }
}