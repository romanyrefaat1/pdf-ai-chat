"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DropzoneProps } from "@/types";

interface ExtendedDropzoneProps extends DropzoneProps {
  size?: "xs" | "sm" | "normal" | "lg" | "xl";
}

const sizeClasses = {
  xs: "min-h-[15vh]",
  sm: "min-h-[20vh]",
  normal: "min-h-[30vh]",
  lg: "min-h-[40vh]",
  xl: "min-h-[50vh]",
};

const Dropzone = ({
  onFileAccepted,
  maxSize = 20971520,
  accept,
  size = "normal",
}: ExtendedDropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: useCallback(
        (acceptedFiles: File[]) => {
          if (acceptedFiles?.[0]) {
            onFileAccepted(acceptedFiles[0]);
          }
        },
        [onFileAccepted]
      ),
      maxSize,
      accept,
      multiple: false,
    });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.name}>
      {file.name} - {errors.map((e) => e.message).join(", ")}
    </li>
  ));

  return (
    <div className="container w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 w-full border-dashed p-8 text-center cursor-pointer flex items-center align-center
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${sizeClasses[size]}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the PDF here...</p>
        ) : (
          <p>Drag and drop a PDF here, or click to select</p>
        )}
      </div>

      {fileRejectionItems.length > 0 && (
        <div className="mt-4 text-red-500">
          <h4>Rejected Files</h4>
          <ul>{fileRejectionItems}</ul>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
