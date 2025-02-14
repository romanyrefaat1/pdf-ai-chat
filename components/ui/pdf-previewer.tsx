"use client";

interface PDFPreviewerProps {
  chatId: string;
}

const PDFPreviewer = ({ chatId }: PDFPreviewerProps) => {
  return (
    <div className="h-full w-full bg-secondary">
      {/* PDF viewer implementation will go here */}
      <div className="p-4">PDF Viewer for chat {chatId}</div>
    </div>
  );
};

export default PDFPreviewer; 