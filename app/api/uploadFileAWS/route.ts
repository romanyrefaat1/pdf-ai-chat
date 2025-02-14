import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure AWS SDK
const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { headers });
  }

  if (!process.env.BUCKET_NAME) {
    return NextResponse.json(
      { error: "AWS bucket name not configured" },
      { status: 500, headers }
    );
  }

  try {
    // Your existing code...
    // Instead of using request.json(), use formData() to parse the incoming FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName")?.toString();
    const fileType = formData.get("fileType")?.toString();

    // Validate input
    if (!file || !fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert the File (from the Web API) to a Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Configure upload parameters for S3
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: fileType,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    return NextResponse.json(
      {
        message: "Upload successful",
        url: `https://${process.env.BUCKET_NAME}.s3.${
          process.env.BUCKET_REGION
        }.amazonaws.com/${encodeURIComponent(fileName)}`,
      },
      { status: 200, headers }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500, headers }
    );
  }
}
