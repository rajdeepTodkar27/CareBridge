import { NextResponse,NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Prescription from "@/models/Prescription";
import MedicationsRoutine from "@/models/MedicationsRoutine";
import Services from "@/models/Services";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


// id is centerId

export async function GET({ params }: { params: { id: string } }) {
    try {
        await connect()
        const id = params.id
        const services = await Services.find({centerId: id})
        if(services.length === 0){
            return NextResponse.json({error : "services not found"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched services data",data: services},{status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}


export async function POST(req: NextRequest) {
    try {
        await connect()
       
        const {  serviceName,centerId,category, department,baseCost,unit,description,isActive} = await req.json()
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== "branchadmin"){
            return NextResponse.json({error: "Unauthorized"},{status: 401})
        }
        const service = new Services({serviceName,centerId,category, department,baseCost,unit,description,isActive})
        await service.save()

        return NextResponse.json({message: "successfully created new service"},{status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connect()
       
        const {  serviceId,serviceName,centerId,category, department,baseCost,unit,description,isActive} = await req.json()
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== "branchadmin"){
            return NextResponse.json({error: "Unauthorized"},{status: 401})
        }
        const service = await Services.findByIdAndUpdate(serviceId,{$set: {serviceName,centerId,category, department,baseCost,unit,description,isActive}})

        return NextResponse.json({message: "update the service"},{status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}