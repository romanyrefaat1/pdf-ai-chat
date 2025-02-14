"use client";
import ChatInputFrom from "@/components/ui/chat-page/chat-input-form";
import ChatPreviewer from "@/components/ui/chat-page/chat-previewer";
import { useState } from "react";
import CustomizableTitle from "../customizable-title";

const ChatSection = ({ chatId }: { chatId: string }) => {
  const [realtimeMessages, setRealtimeMessages] = useState([]);

  return (
    <div className="relative h-screen w-full bg-secondary flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10">
        <CustomizableTitle chatId={chatId} />
      </div>

      <div className="flex-1 w-full mt-[60px] overflow-hidden">
        <ChatPreviewer chatId={chatId} realtimeMessages={realtimeMessages} />
      </div>

      <div className="w-full h-[150px] shrink-0">
        <ChatInputFrom
          setRealtimeMessages={setRealtimeMessages}
          inputClassName="group-focus:bg-red-500 outline-none w-full"
          chatId={chatId}
          placeholder="Ask anything in the PDF now"
        />
      </div>
    </div>
  );
};

export default ChatSection;
