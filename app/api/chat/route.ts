import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  console.log(`POST request started`);
  try {
    const { message, chatHistory } = await req.json();

    // Debug log to verify token
    console.log(`chatHistory:`, chatHistory)

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API token not configured" },
        { status: 500 }
      );
    }

    console.log("Attempting API call to Gemini...");

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = message;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return NextResponse.json({ modelAnswer: result.response.text() });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to call Gemini API", details: error.message },
      { status: 500 }
    );
  }
}
