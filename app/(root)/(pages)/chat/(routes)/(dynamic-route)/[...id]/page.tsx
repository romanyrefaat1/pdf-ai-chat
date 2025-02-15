import { Metadata } from "next";
import PDFChatLayout from "@/components/ui/pdf-chat-layout";
import ChatSection from "@/components/ui/chat-page/chat-section";
import PDFPreviewer from "@/components/ui/chat-page/pdf-previewer";
import { db } from "@/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  return {
    title: `Chat ${params.id[0]}`,
  };
};

export default async function DynamicChat({ params }: Props) {
  const { id } = params;

  const chatDocRef = doc(db, "chats", id[0]);
  const chatSnap = await getDoc(chatDocRef);

  if (!chatSnap || !chatSnap.exists()) {
    notFound();
  }

  return (
    <PDFChatLayout
      pdfPreview={<PDFPreviewer chatId={id[0]} />}
      chatSection={<ChatSection chatId={id[0]} />}
    />
  );
}
