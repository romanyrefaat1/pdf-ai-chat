"use client";

import { useEffect, useState } from "react";
import { where } from "firebase/firestore";
import Spinner from "../loading-spinner";

const PDFPreviewer = ({ chatId }: { chatId: string }) => {
  const [pdfUrl, setPDFUrl] = useState<string | null>(``);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`/api/getPdf`, {
          method: "POST",
          headers: {
            Accept: "application/pdf",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectionPath: "chats",
            constraint: where("docId", "==", chatId),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPDFUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading PDF");
      }
    };
    fetchPdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [chatId, pdfUrl]);

  if (error) {
    return (
      <div className="w-full flex items-center bg-secondary/50 h-full justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="w-full flex items-center bg-secondary/50 h-full justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <object data={pdfUrl} type="application/pdf" className="w-full h-full">
        <div className="w-full flex items-center bg-secondary/50 h-full justify-center">
          <p>
            Unable to display PDF.{" "}
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              Download
            </a>{" "}
            instead.
          </p>
        </div>
      </object>
    </div>
  );
};

export default PDFPreviewer;
