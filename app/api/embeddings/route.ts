import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    console.log(`Embedded started...`)
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const embedding = await model.embedContent(text);

    console.log(`Embeddin succeeded...`)

    return NextResponse.json({ 
      embedding: embedding.embedding 
    })
  } catch (error) {
    console.error("Error creating embedding:", error);
    return NextResponse.json(
      { error: "Failed to create embedding" },
      { status: 500 }
    );
  }
} 