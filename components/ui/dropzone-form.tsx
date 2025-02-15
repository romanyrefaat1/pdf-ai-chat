"use client";

import { useState } from "react";
import Dropzone from "./dropzone";
import { handleFileUpload } from "@/actions/upload";

interface DropzoneFormProps {
  size?: "xs" | "sm" | "normal" | "lg" | "xl";
  accept?: Record<string, string[]>;
}

const DropzoneForm = ({ size = "normal", accept }: DropzoneFormProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onFileAccepted = async (file: File) => {
    try {
      setIsUploading(true);
      await handleFileUpload(file);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dropzone
      onFileAccepted={onFileAccepted}
      size={size}
      accept={accept}
      maxSize={20 * 1024 * 1024} // 20MB
    />
  );
};

export default DropzoneForm;
