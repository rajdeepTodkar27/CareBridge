import { NextResponse,NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import {connect} from '@/dbconfig/dbconfig'
import User from '@/models/User';


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    await connect();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: email, password: hashedPassword,role: 'patient' });
    await user.save();

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error) {
      console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    
  }
}
