// app/api/getPdf/route.ts
import { NextResponse } from "next/server";
import { fetchDataFromFireStore } from "@/lib/firebase";
import { collection } from "firebase/firestore";
import { db } from "@/firebase-config";

export async function POST(request: Request) {
  const { constraint, collectionPath } = await request.json();

  if (!collectionPath || !constraint) {
    console.error("Collection and constraint parameters are required");
    return NextResponse.json(
      { error: "Collection and constraint parameters are required" },
      { status: 400 }
    );
  }

  // Get chat document from Firestore
  const collectionRef = collection(db, collectionPath);
  try {
    const chatData = await fetchDataFromFireStore(collectionRef, [constraint]);
    if (!chatData || !Array.isArray(chatData) || !chatData[0]) {
      return NextResponse.json(
        { error: "Chat data not found" },
        { status: 505 }
      );
    }

    const fileUrl = chatData[0]?.fileUrl;

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL not found" },
        { status: 404 }
      );
    }

    // Fetch the PDF directly from the S3 URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF from S3: ${response.statusText}`);
    }

    // Get the PDF data
    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF with the necessary headers
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Length", pdfBuffer.byteLength.toString());
    headers.set("Content-Disposition", "inline");
    headers.set("X-Content-Type-Options", "nosniff");
    // Allow embedding in iframes from same origin
    headers.set("X-Frame-Options", "SAMEORIGIN");

    return new Response(pdfBuffer, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
  }
}
