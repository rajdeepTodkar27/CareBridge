import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getServerSession } from "next-auth";           
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import HospitalAdmissions from "@/models/HospitalAdmissions";
import ProfileStaff from "@/models/ProfileStaff";

export async function GET() {
    try {
        await connect()
        const session = await getServerSession(authOptions)

        if(!session || session.user.role != "nurse"){
            return NextResponse.json({error: "Unauthorize"},{status: 401})
        }
        const user = await User.findOne({email: session.user.email})
        if(!user){
            return NextResponse.json({error: "User not found"},{status: 404})
        }
        const profile = await ProfileStaff.findOne({user: user._id})
        
        if(!profile){
            return NextResponse.json({error: "Not found Nurse profile"},{status: 404})
        }

        const patients = await HospitalAdmissions.find({assignedNurse: profile._id, isDischarged: false})
        .populate({path: "patient",select: "patient fullName gender"})
        .select("patient bedNo")

        if(patients.length ===0){
            return NextResponse.json({error: "patient not found"},{status: 404})
        }
        return NextResponse.json({message: "successfully fetched the patients data", data: patients},{status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}




// sample responce

// {
//       "_id": "666abc12345def6789012345",
//       "bedNo": "B12",
//       "patient": {
//         "_id": "665def1234567890abc12345",
//         "patient": "P1001",
//         "fullName": "Rahul Sharma",
//         "gender": "Male"
//       }
//     },
