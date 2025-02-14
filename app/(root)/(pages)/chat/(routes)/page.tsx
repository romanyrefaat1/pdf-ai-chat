"use client";
import DropzoneForm from "@/components/ui/dropzone-form";

const DefaultChatPage = () => {
  const handleAcceptFile = () => {};
  return (
    <div className="h-[100vh] flex gap-y-4 flex-col items-center justify-center align-center">
      <h1 className="text-3xl font-bold text-center">
        What PDF would you like to explore today?
      </h1>
      <DropzoneForm size="sm" acceptFunction={() => handleAcceptFile()} />
    </div>
  );
};

export default DefaultChatPage;
