"use client";

import { Send } from "lucide-react";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { fetchAIResponse, sendNewMessageToChat } from "@/lib/firebase";
import { useState } from "react";
import { toast } from "sonner";
import { findRelevantChunks } from "@/lib/utils/pdf-chunker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase-config";

interface Chunk {
  text: string;
  embedding: number[];
  pageNumber: number;
}

interface Message {
  label: string;
  chatId: string;
  role: string;
}

interface ChatInputFormProps {
  inputClassName: string;
  chatId: string;
  placeholder: string;
  setRealtimeMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

const ChatInputForm = ({
  inputClassName,
  chatId,
  setRealtimeMessages,
  placeholder,
}: ChatInputFormProps) => {
  const [textAreaValue, setTextAreaValue] = useState("wat is context about?");
  const [isLoading, setIsLoading] = useState(false);

  const getRelevantContext = async (query: string, chatId: string) => {
    try {
      const chunksCollectionRef = collection(db, "chats", chatId, "chunks");
      const chunksSnapshot = await getDocs(chunksCollectionRef);

      if (chunksSnapshot.empty) {
        console.error("No chunks found for this chat");
        return "";
      }

      const chunks = chunksSnapshot.docs.map((doc) => doc.data() as Chunk);
      console.log("Retrieved chunks:", chunks.length);

      const relevantChunks = await findRelevantChunks(query, chunks);
      console.log("Relevant chunks found:", relevantChunks.length);

      if (relevantChunks.length === 0) {
        return "No relevant context found in the document.";
      }

      return relevantChunks.join("\n\n");
    } catch (error) {
      console.error("Error getting relevant context:", error);
      return "";
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (textAreaValue.length === 0) {
      toast.warning("You can't send an empty message.");
      return;
    }

    setIsLoading(true);

    try {
      const myNewMessage: Message = {
        label: textAreaValue,
        chatId,
        role: "user",
      };

      setRealtimeMessages((prev: Message[]) => [...prev, myNewMessage]);
      await sendNewMessageToChat({ label: textAreaValue }, chatId, true);

      const context = await getRelevantContext(textAreaValue, chatId);

      if (!context) {
        toast.error("Could not find relevant context in the document");
        setIsLoading(false);
        return;
      }

      const prompt = `
        You are a helpful AI assistant. Use the following context from the PDF to answer the user's question.
        If the context doesn't contain relevant information to answer the question, please reason the answer by yourself and search on the internet for the answer, and mention that the answer is not provided in the PDF.

        Context from the PDF:
        ${context}

        User's question:
        ${textAreaValue}

        Please provide a detailed answer based on the context above. If the context doesn't contain enough information to answer the question, please reason the answer by yourself and search on the internet for the answer, and then mention that the answer is not provided in the PDF. And never not answer a question.
      `;

      const aiResponse = await fetchAIResponse(prompt, "");

      if (aiResponse?.error) {
        console.error("AI Response Error:", aiResponse.error);
        toast.error("Couldn't get the AI response.");
        return;
      }

      const aiNewRealtimeMessage: Message = {
        label: aiResponse?.modelAnswer,
        chatId,
        role: "assistant",
      };

      setRealtimeMessages((prev: Message[]) => [...prev, aiNewRealtimeMessage]);
      await sendNewMessageToChat(
        { label: aiResponse?.modelAnswer },
        chatId,
        false
      );

      setTextAreaValue("");
    } catch (error) {
      console.error("Error in handleSubmitForm:", error);
      toast.error("Error processing your request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="w-full h-full bg-transparent relative"
    >
      <textarea
        disabled={isLoading}
        className={cn(
          "outline-hidden bg-background p-[15px] resize-none w-full h-[150px] border border-muted-foreground/200 rounded-t-[30px]",
          inputClassName
        )}
        placeholder={isLoading ? "Processing..." : placeholder}
        value={textAreaValue}
        onChange={(e) => setTextAreaValue(e.target.value)}
      />
      <Button
        variant="outlineReverse"
        className="rounded-full absolute right-5 bottom-5"
        size="sm"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <Send />
        )}
      </Button>
    </form>
  );
};

export default ChatInputForm;