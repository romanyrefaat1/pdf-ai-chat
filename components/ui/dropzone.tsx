"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";

type DropzoneSize = "xs" | "sm" | "normal" | "lg" | "xl";

const sizeClasses = {
  xs: "min-h-[15vh]",
  sm: "min-h-[20vh]",
  normal: "min-h-[30vh]",
  lg: "min-h-[40vh]",
  xl: "min-h-[50vh]",
};

export default function PdfDropzone({
  file,
  setFile,
  size = "normal",
}: {
  file: any;
  setFile: any;
  size?: DropzoneSize;
}) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    toast.success(`Your PDF is uploaded successfully`);
    // console.log(`accepted:`, acceptedFiles[0]);
    const newFile = acceptedFiles[0];
    // console.log(`newFile`, newFile);

    setFile({
      fileData: newFile,
      preview: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);

  // useEffect(() => console.log(`file:`, file), [file]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      multiple: false,
    });

  const fileRejectionItems = fileRejections.map(
    ({ file, errors }: { file: File; errors: any[] }) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
        <ul>
          {errors.map((e) => (
            <li key={e.code} className="text-red-500">
              {e.message}
            </li>
          ))}
        </ul>
      </li>
    )
  );

  return (
    <div className="container w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 w-full border-dashed p-8 text-center cursor-pointer flex items-center align-center
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${sizeClasses[size]}`}
      >
        <input
          {...getInputProps()}
          className=" absolute top-0 left-0 flex items-center align-center"
        />
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

      {file !== null && (
        <div className="mt-4">
          <h4>Accepted PDF</h4>
          <div>
            <div className="text-sm">
              Name:{" "}
              <span className={`text-muted-foreground`}>{file.fileData.name}</span>
            </div>
            <div className="text-sm">
              Size:{" "}
              <span className="text-muted-foreground">
                {file.fileData.size} bytes
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
