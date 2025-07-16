import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/libs/cloudinary';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folder = formData.get("folder") as string;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: folder,
           resource_type: "auto", // 👈 IMPORTANT: allows PDF, video, images, etc.
          use_filename: true,
          unique_filename: true,
         },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json(uploadResult);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
