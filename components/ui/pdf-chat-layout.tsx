"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";

interface PDFChatLayoutProps {
  pdfPreview: React.ReactNode;
  chatSection: React.ReactNode;
}

const PDFChatLayout = ({ pdfPreview, chatSection }: PDFChatLayoutProps) => {
  const [pdfWidth, setPdfWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [collapsed, setCollapsed] = useState<"none" | "pdf" | "chat">("none");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeView, setActiveView] = useState<"pdf" | "chat">("chat");

  const isResizingRef = useRef(false);
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) {
      setCollapsed("none");
    }
  }, [isMobile]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    setIsResizing(true);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current || !layoutRef.current) return;

    const layoutRect = layoutRef.current.getBoundingClientRect();
    const relativeX = event.clientX - layoutRect.left;
    const percentage = (relativeX / layoutRect.width) * 100;

    const newWidth = Math.max(30, Math.min(70, percentage));
    setPdfWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const ToggleButtons = ({ className }: { className?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn("flex justify-center gap-2 py-2", className)}
    >
      <button
        onClick={() =>
          collapsed === "chat" ? setCollapsed("none") : setCollapsed("pdf")
        }
        className={cn(
          "p-2 rounded flex items-center gap-2 bg-secondary/80 backdrop-blur-sm shadow-lg",
          collapsed === "pdf" ? "bg-primary/10" : "hover:bg-primary/5"
        )}
      >
        <FileText size={20} className="text-muted-foreground" />
        PDF
      </button>
      <button
        onClick={() =>
          collapsed === "pdf" ? setCollapsed("none") : setCollapsed("chat")
        }
        className={cn(
          "p-2 rounded flex items-center gap-2 bg-secondary/80 backdrop-blur-sm shadow-lg",
          collapsed === "chat" ? "bg-primary/10" : "hover:bg-primary/5"
        )}
      >
        <MessageSquare size={20} className="text-muted-foreground" />
        Chat
      </button>
    </motion.div>
  );

  if (isMobile) {
    return (
      <div ref={layoutRef} className="flex flex-col h-screen w-full relative">
        <ToggleButtons className="border-b bg-secondary" />
        <div className="flex-1 relative overflow-hidden">
          <div
            style={{
              transform:
                activeView === "chat" ? "translateX(0)" : "translateX(-100%)",
              display: activeView === "chat" ? "block" : "none",
            }}
            className="absolute inset-0 w-full h-full transition-transform duration-300"
          >
            {chatSection}
          </div>
          <div
            style={{
              transform:
                activeView === "pdf" ? "translateX(0)" : "translateX(100%)",
              display: activeView === "pdf" ? "block" : "none",
            }}
            className="absolute inset-0 w-full h-full transition-transform duration-300"
          >
            {pdfPreview}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={layoutRef} className="flex h-screen w-full relative">
      <div
        style={{
          width:
            collapsed === "chat"
              ? "100%"
              : collapsed === "pdf"
              ? "0"
              : `${pdfWidth}%`,
        }}
        className="relative"
      >
        <button
          onClick={() => setCollapsed(collapsed === "pdf" ? "none" : "pdf")}
          className="absolute right-4 top-4 z-10 p-2 rounded hover:bg-primary/10"
        >
          {collapsed === "pdf" ? (
            <ChevronsRight className="text-muted-foreground" size={20} />
          ) : (
            <ChevronsLeft className="text-muted-foreground" size={20} />
          )}
        </button>
        {pdfPreview}
      </div>

      {collapsed === "none" && !isMobile && (
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            "w-2 cursor-col-resize bg-primary/10 hover:bg-primary/20",
            isResizing && "bg-primary/30"
          )}
        />
      )}

      <div
        style={{
          width:
            collapsed === "pdf"
              ? "100%"
              : collapsed === "chat"
              ? "0"
              : `calc(100% - ${pdfWidth}%)`,
        }}
        className="relative"
      >
        <button
          onClick={() => setCollapsed(collapsed === "chat" ? "none" : "chat")}
          className="absolute left-4 top-4 z-10 p-2 rounded hover:bg-primary/10"
        >
          {collapsed === "chat" ? (
            <ChevronsLeft className="text-muted-foreground" size={20} />
          ) : (
            <ChevronsRight className="text-muted-foreground" size={20} />
          )}
        </button>
        {chatSection}
      </div>

      <AnimatePresence>
        {(collapsed === "pdf" || collapsed === "chat") && (
          <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 z-50">
            <ToggleButtons />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFChatLayout;