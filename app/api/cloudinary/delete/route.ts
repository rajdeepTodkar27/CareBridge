import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/libs/cloudinary';

export async function POST(req: NextRequest) {
  const { publicId } = await req.json();
  console.log(publicId);
  
  if (!publicId) {
    return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
