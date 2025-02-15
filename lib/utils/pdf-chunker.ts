import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

interface Chunk {
  text: string;
  embedding: number[];
  pageNumber: number;
}

async function createEmbeddingServerSide(text: string): Promise<number[]> {
  console.log(">> Entering createEmbeddingServerSide");
  console.log("Input text length:", text.length);

  // Check if text is empty after trimming spaces
  if (!text.trim()) {
    console.error("createEmbeddingServerSide: Empty text for embedding");
    throw new Error("Empty text for embedding");
  }
  console.log("Text is non-empty, proceeding with embedding...");

  // Get the generative model for embedding
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  console.log("Obtained model:", model);

  // Call the model's embedContent function
  console.log("Calling embedContent with text...");
  const result = await model.embedContent(text);

  console.log("<< Exiting createEmbeddingServerSide");
  return result.embedding.values;
}

function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

function splitTextIntoSentences(text: string): string[] {
  // Split on both Arabic and English sentence endings
  // Arabic period: '؟' and '.'
  return text
    .split(/(?<=[.؟!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function chunkAndIndexPDF(pdfText: string): Promise<Chunk[]> {
  console.log(">> Entering chunkAndIndexPDF");
  console.log("PDF text length:", pdfText.length);

  const hasArabic = containsArabic(pdfText);
  console.log("Contains Arabic text:", hasArabic);

  // Return early if pdfText is empty
  if (!pdfText.trim()) {
    console.error("chunkAndIndexPDF: Empty pdfText provided");
    return [];
  }

  const chunkSize = hasArabic ? 500 : 1000; // Smaller chunks for Arabic text
  console.log("Chunk size set to:", chunkSize);

  const chunks: Chunk[] = [];
  // Split based on language-aware sentence boundaries
  const sentences = splitTextIntoSentences(pdfText);
  console.log("Total sentences found:", sentences.length);

  let accumulatedText = "";
  let currentPage = 1;
  let isFirstChunk = true;

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();

    // Check for page markers
    const pageMatch = trimmedSentence.match(/^(?:Page|صفحة)\s+(\d+):/i);
    if (pageMatch) {
      const pageNum = parseInt(pageMatch[1]);
      // console.log(`Found page marker for page ${pageNum}`);

      // If we have accumulated text, create a chunk before moving to new page
      if (accumulatedText.trim() && !isFirstChunk) {
        try {
          console.log(
            `Creating chunk for page ${currentPage} with length ${accumulatedText.length}`
          );
          const embedding = await createEmbeddingServerSide(accumulatedText);
          chunks.push({
            text: accumulatedText,
            embedding: embedding,
            pageNumber: currentPage,
          });
          console.log(`Successfully created chunk for page ${currentPage}`);
        } catch (error) {
          console.error(`Error creating chunk for page ${currentPage}:`, error);
        }
      }

      // Update current page and reset accumulated text
      currentPage = pageNum;
      accumulatedText = trimmedSentence
        .replace(/^(?:Page|صفحة)\s+\d+:\s*/i, "")
        .trim(); // Remove page marker and store content
      isFirstChunk = false;
      continue;
    }

    // Accumulate text while respecting chunk size
    if (!isFirstChunk) {
      if (accumulatedText) {
        accumulatedText += hasArabic ? " " : "\n\n";
      }
      accumulatedText += trimmedSentence;

      if (accumulatedText.length >= chunkSize) {
        try {
          console.log(
            `Creating chunk for page ${currentPage}, contains Arabic: ${hasArabic}`
          );
          const embedding = await createEmbeddingServerSide(accumulatedText);
          chunks.push({
            text: accumulatedText,
            embedding: embedding,
            pageNumber: currentPage,
          });
          accumulatedText = "";
        } catch (error) {
          console.error(`Error creating chunk for page ${currentPage}:`, error);
          console.error("Text sample:", accumulatedText.substring(0, 100));
        }
      }
    }
  }

  // Handle any remaining text
  if (accumulatedText.trim() && !isFirstChunk) {
    try {
      console.log(`Creating final chunk for page ${currentPage}`);
      const embedding = await createEmbeddingServerSide(accumulatedText);
      chunks.push({
        text: accumulatedText,
        embedding: embedding,
        pageNumber: currentPage,
      });
    } catch (error) {
      console.error("Error creating final chunk:", error);
    }
  }

  console.log(`Chunking complete. Total chunks created: ${chunks.length}`);
  if (chunks.length > 0) {
    // console.log("First chunk preview:", chunks[0].text.substring(0, 100));
  }

  return chunks;
}

export async function findRelevantChunks(
  query: string,
  chunks: Chunk[],
  topK: number = 3
): Promise<string[]> {
  try {
    if (!chunks?.length) {
      console.error("No chunks provided for search");
      return [];
    }

    // console.log(`Searching through ${chunks.length} chunks`);

    const queryEmbedding = await createEmbeddingServerSide(query);

    const similarities = chunks.map((chunk) => ({
      chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    const topChunks = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    // console.log(`Found ${topChunks.length} relevant chunks`);
    return topChunks.map(({ chunk }) => chunk.text);
  } catch (error) {
    console.error("Error finding relevant chunks:", error);
    return [];
  }
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  try {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
  } catch (error) {
    console.error("Error calculating similarity:", error);
    return 0;
  }
}
