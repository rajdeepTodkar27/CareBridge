import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/User";
import PatientsProfile from "@/models/PatientsProfile";
import Vitals from "@/models/Vitals";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function GET(req: NextRequest) {
    try {
        await connect();
        const session = await getServerSession(authOptions)
        if(!session || session.user?.role!=='patient'){
            return NextResponse.json({error: "Unauthorized"},{status: 401})
        }
        const email = session.user.email
        const user = await User.findOne({email})
        const patientProfile = await PatientsProfile.findOne({patient: user._id})
        .populate({path: "vitals", select: "-_id"})
        if(!patientProfile){
            return NextResponse.json({error: "patients profile not found"},{status: 404})
        }
        return NextResponse.json({ message: "successfully fetched the patient profile details", data: patientProfile },{status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function Post(req: NextRequest) {
    try {
        await connect();
        const { email, fullName, aadharNo, gender, dateOfBirth, mobileNo, emergencyContact, occupation, lifestyle,
            weight, height, bmi, heartRate, bloodSugar, bloodPressure, temperature,
        } = await req.json()
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const allowedGenders = ['male', 'female', 'trans']
        if (!allowedGenders.includes(gender)) {
            return NextResponse.json({ error: "Invalid gender value" }, { status: 400 })
        }
        const patientProfile = await PatientsProfile.findOne({ patient: user._id })
        const vitals = await Vitals.findOne({ patient: user._id })
        let patientvital
        if (!vitals) {
            patientvital = new Vitals({ patient: user._id, weight, height, bmi, heartRate, bloodSugar, bloodPressure, temperature })
            await patientvital.save()
        } else {
            patientvital = await Vitals.findByIdAndUpdate(vitals._id, { $set: { weight, height, bmi, heartRate, bloodSugar, bloodPressure, temperature } }, { new: true })
        }
        if (patientProfile) {
            await PatientsProfile.findByIdAndUpdate(patientProfile._id, { $set: { fullName, aadharNo, gender, dateOfBirth, mobileNo, emergencyContact, occupation, lifestyle } })
            return NextResponse.json({ message: "successfully updated the patients profile" }, { status: 200 })
        }
        const patientProf = new PatientsProfile({ patient: user._id, fullName, aadharNo, gender, dateOfBirth, mobileNo, emergencyContact, occupation, lifestyle, vitals: patientvital?._id || vitals?._id })
        await patientProf.save()
        return NextResponse.json({ message: "successfully created the profile" }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// sample responce
// {
//     "_id": "666a9d5ecf4c6e91eacccf42",
//     "patient": "666a9d5ecf4c6e91eacccf35",
//     "fullName": "Rajdeep Todkar",
//     "aadharNo": 123456789012,
//     "gender": "male",
//     "dateOfBirth": "1997-08-15T00:00:00.000Z",
//     "mobileNo": 9876543210,
//     "emergencyContact": 9988776655,
//     "occupation": "Software Engineer",
//     "lifestyle": "Active",
//     "vitals": {
//       "weight": 72,
//       "height": 175,
//       "bmi": 23.51,
//       "heartRate": 72,
//       "bloodSugar": 90,
//       "bloodPressure": "120/80",
//       "temperature": 98.6
//     }
//   }