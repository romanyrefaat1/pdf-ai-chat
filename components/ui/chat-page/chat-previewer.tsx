"use client";
import { fetchDataFromFireStore } from "@/lib/firebase";
import Message from "./message";
import { collection, orderBy } from "firebase/firestore";
import { db } from "@/firebase-config";
import { useEffect, useState, useRef } from "react";
import Spinner from "../loading-spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ChatPreviewerProps {
  chatId: string;
  realtimeMessages: any[];
}

const ChatPreviewer = ({ chatId, realtimeMessages }: ChatPreviewerProps) => {
  const [initialMessages, setInitialMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatDoc = await fetchDataFromFireStore(
          collection(db, "chats"),
          chatId
        );

        if (!chatDoc) {
          toast.error(
            "Sorry there is no chat with this ID. You will be redirected to /chat"
          );
          router.push("/chat");
          return;
        }

        const data = await fetchDataFromFireStore(
          collection(db, "chats", chatId, "messages"),
          orderBy("createdAt", "asc")
        );

        setLoading(false);
        setInitialMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    if (mounted) {
      fetchMessages();
    }
  }, [chatId, mounted, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [realtimeMessages]);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 py-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            ) : (
              <>
                {initialMessages?.map((message, index) => (
                  <div
                    key={`initial-${index}-${message?.label}`}
                    className={cn(
                      "flex w-full",
                      message?.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%]",
                        message?.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message?.label}</p>
                    </div>
                  </div>
                ))}
                {realtimeMessages?.map((message, index) => (
                  <div
                    key={`realtime-${index}-${message?.label}`}
                    className={cn(
                      "flex w-full",
                      message?.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%]",
                        message?.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message?.label}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreviewer;
