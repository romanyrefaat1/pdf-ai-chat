"use client";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import MarkdownDisplay from "../markdown-display";

const Message = ({
  label = "",
  isUser = true,
  isAnimation = false,
}: {
  label: string;
  isUser: boolean;
  isAnimation: boolean;
}) => {
  const { user } = useUser();

  return (
    <div
      className={cn(
        "user-message flex gap-x-2 items-start py-4 px-2",
        !isUser && "flex-row-reverse items-start"
      )}
      suppressHydrationWarning
    >
      <div className="flex-shrink-0">
        {isUser ? (
          <Avatar>
            <AvatarImage 
              className="w-8 h-8 rounded-full" 
              src={user?.imageUrl} 
              alt="User avatar"
            />
          </Avatar>
        ) : (
          <Avatar className="w-8 h-8 rounded-full bg-primary/10">
            <AvatarImage 
              className="p-1" 
              src="/file.svg" 
              alt="AI avatar"
            />
          </Avatar>
        )}
      </div>

      <div className={cn(
        "flex-1 px-4 py-2 rounded-lg",
        isUser ? "bg-primary/10" : "bg-muted"
      )}>
        {isUser ? (
          <div className="whitespace-pre-wrap break-words">
            {label}
          </div>
        ) : (
          <div suppressHydrationWarning>
            <MarkdownDisplay isAnimation={isAnimation} content={label} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
