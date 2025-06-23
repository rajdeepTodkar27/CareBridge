import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/User";
import ProfilePharmasist from "@/models/ProfilePharmasist";
import AllCare from "@/models/AllCare";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        await connect();
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'pharmasist') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email;
        const user = await User.findOne({ email });

        const pharmacistProfile = await ProfilePharmasist.findOne({ user: user._id })
            .populate({ path: "store", select: "name" });

        if (!pharmacistProfile) {
            return NextResponse.json({ error: "Pharmacist profile not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Successfully fetched the pharmacist profile", data: pharmacistProfile }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connect();
        const session = await getServerSession(authOptions);
         if (!session || session.user?.role !== 'pharmasist') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const {
             ownerName, licenseNo, licenseAuthority,
            education, experience, avatarUrl
        } = await req.json();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const pharmacistProfile = await ProfilePharmasist.findOne({ user: user._id });

        if (pharmacistProfile) {
            await ProfilePharmasist.findByIdAndUpdate(pharmacistProfile._id, {
                $set: {
                    ownerName,
                    licenseNo,
                    licenseAuthority,
                    education,
                    experience,
                    avtarImg: avatarUrl
                }
            });

            return NextResponse.json({ message: "Successfully updated the pharmacist profile" }, { status: 200 });
        }

        const store = await AllCare.findOne({centerId: session.user.centerId}) 
        if (!store) {
            return NextResponse.json({ error: "Store not found for given centerId" }, { status: 404 });
        }
        const newPharmacistProfile = new ProfilePharmasist({
            user: user._id,
            store: store._id,
            ownerName,
            licenseNo,
            licenseAuthority,
            education,
            experience,
            avtarImg: avatarUrl
        });

        await newPharmacistProfile.save();
        return NextResponse.json({ message: "Successfully created the pharmacist profile" }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
