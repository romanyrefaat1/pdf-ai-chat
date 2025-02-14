"use client";
import { useContext, useState } from "react";
import { Button } from "./button";
import Dropzone from "./dropzone";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { SignIn, useAuth, useUser } from "@clerk/clerk-react";
import { ModalContext } from "../providers/modal-context";
import { createNewChatInFireStore } from "@/lib/firebase";
import Spinner from "./loading-spinner";

type FileWithPreview = File & {
  preview: string;
};

type DropzoneSize = "xs" | "sm" | "normal" | "lg" | "xl";

const buttonSizes = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-4",
  normal: "h-10 px-4",
  lg: "h-11 px-6",
  xl: "h-12 px-8 text-lg",
};

const DropzoneForm = ({
  size = "normal",
  acceptFunction = () => {},
}: {
  size?: DropzoneSize;
  acceptFunction: () => void;
}) => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { openModal } = useContext(ModalContext);
  const { userId } = useAuth();

  const handleUpload = async () => {
    if (!isSignedIn || !isLoaded) {
      toast.warning(`Please sign in first.`);
      openModal(<SignIn />);
      return;
    }
    openModal(
      <div>
        <Spinner />
        You are being redirected to the chat page
      </div>
    );
    if (file === null) {
      toast.warning(
        <p>
          Please upload a file first or visit{" "}
          <Link href={`/chat`} className="underline">
            Chat
          </Link>
        </p>
      );

      acceptFunction();
      return;
    }

    const data = { userId: userId };
    const chatId = await createNewChatInFireStore(file.fileData, data);
    // console.log(`chatId`, chatId);
    router.push(`/chat/${chatId}`);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <Dropzone file={file} setFile={setFile} size={size} />
      <Button
        className={`justify-self-end ${buttonSizes[size]}`}
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default DropzoneForm;
