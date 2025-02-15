"use client";
import DropzoneForm from "@/components/ui/dropzone-form";

export default function DefaultChatPage() {
  return (
    <div className="h-[100vh] flex gap-y-4 flex-col items-center justify-center align-center">
      <h1 className="text-3xl font-bold text-center">
        What PDF would you like to explore today?
      </h1>
      <DropzoneForm
        size="sm"
        accept={{
          "application/pdf": [".pdf"],
        }}
      />
    </div>
  );
}
