import { NextResponse } from "next/server";
import { chunkAndIndexPDF } from "@/lib/utils/pdf-chunker";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase-config";
import * as pdfjs from "pdfjs-dist";
import path from 'path';

// Configure PDF.js for server-side usage
const pdfjsDistPath = path.join(process.cwd(), 'node_modules/pdfjs-dist');
if (typeof window === 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = path.join(
    pdfjsDistPath,
    'build',
    'pdf.worker.js'
  );
}

export async function POST(request) {
  try {
    console.log("Processing PDF from server...");
    const { pdfUrl, chatId } = await request.json();
    console.log("PDF URL:", pdfUrl);
    console.log("Chat ID:", chatId);

    if (!pdfUrl || !chatId) {
      console.error("Missing required parameters");
      return NextResponse.json(
        { error: "PDF URL and Chat ID are required" },
        { status: 400 }
      );
    }

    // Fetch the PDF from the URL
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      console.error("Failed to fetch PDF:", response.statusText);
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    const pdfBuffer = await response.arrayBuffer();
    console.log("PDF buffer received.");
    console.log("Loadin task will start...");

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({
      data: pdfBuffer,
      cMapUrl: `${pdfjsDistPath}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${pdfjsDistPath}/standard_fonts/`,
    });
    console.log(`Loadin task successed`)
    
    const pdf = await loadingTask.promise;
    console.log("PDF loaded. Number of pages:", pdf.numPages);

    // Extract text from each page
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += `Page ${i}:\n${pageText}\n\n`;
      // console.log(`Processed page ${i}/${pdf.numPages}`);
      // console.log(`current fullText:`, fullText)
    }

    if (!fullText.trim()) {
      throw new Error("No text content extracted from PDF");
    }

    // Chunk the extracted text and save to Firestore
    // console.log(`full text:`, fullText)
    console.log(`Creatin chunkAndIndexPDF...`)
    const chunks = await chunkAndIndexPDF(fullText);
    console.log(`chunks:`, chunks)
    console.log(`Created ${chunks.length} chunks`);
    const chunksCollectionRef = collection(db, "chats", chatId, "chunks");

    await Promise.all(
      chunks.map((chunk, index) =>{
        console.log(`settin te cunck document in firebase`)
        setDoc(doc(chunksCollectionRef, `chunk_${index}`), {
          text: chunk.text,
          embedding: chunk.embedding,
          pageNumber: chunk.pageNumber,
          timestamp: new Date().toISOString(),
          chunkIndex: index,
        })
      }
    )
    );

    console.log("All chunks saved successfully.");
    return NextResponse.json({
      success: true,
      chunksCount: chunks.length,
      textLength: fullText.length,
    });
  } catch (error) {
    console.error("PDF Processing Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}