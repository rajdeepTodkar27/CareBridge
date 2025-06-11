import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";           
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import { error } from "console";
import ProfileDoctor from "@/models/ProfileDoctor";
import HospitalAdmissions from "@/models/HospitalAdmissions";

export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)

        if(!session || session.user.role != "doctor"){
            return NextResponse.json({error: "Unauthorize"},{status: 401})
        }
        const user = await User.findOne({email: session.user.email})
        if(!user){
            return NextResponse.json({error: "User not found"},{status: 404})
        }
        const profile = await ProfileDoctor.findOne({user: user._id})
        
        if(!profile){
            return NextResponse.json({error: "Not found Doctors profile"},{status: 404})
        }

        const patients = await HospitalAdmissions.find({assignedDoctor: profile._id, isDischarged: false})
        .populate({path: "patient",select: "patient fullName gender mobileNo"})
        .populate({path: "assignedNurse", select: "fullName" })
        .select("patient bedNo assignedNurse")

        if(!patients){
            return NextResponse.json({error: "patient not found"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched the patients data", data: patients},{status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}



// sample responce
//  {
//       "_id": "665fc90f3b6d2b92fce73512",
//       "patient": {
//         "_id": "665fc7d43b6d2b92fce73511",
//         "patient": "665fc6c13b6d2b92fce73510",
//         "fullName": "Ravi Sharma",
//         "gender": "male",
//         "mobileNo": 9876543210
//       },
//       "bedNo": "B12",
//       "assignedNurse": {
//         "_id": "665fc7003b6d2b92fce73514",
//         "fullName": "Nurse Anita"
//       }
//     },