"use client";
import { deleteDocFromFireStore, fetchDataFromFireStore } from "@/lib/firebase";
import Item from "./item";
import { db } from "@/firebase-config";
import { collection, doc, where } from "firebase/firestore";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./loading-spinner";

interface ChatData {
  docId: string;
  userId: string;
  chatTitle: string;
}

const ChatsList = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [chatsData, setChatsData] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [docsOccur, setDocsOccur] = useState(false);

  useEffect(() => {
    const fetchChatsData = async () => {
      if (!userId) return;
      const chatsCollection = collection(db, "chats");
      const chatsSnapshot = await fetchDataFromFireStore(
        chatsCollection,
        where(`userId`, `==`, userId)
      );
      // console.log(chatsSnapshot, `snapsot`);
      if (chatsSnapshot.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(false);
      setChatsData(chatsSnapshot || []);
      setDocsOccur(true);
    };

    fetchChatsData();
  }, [userId]);

  const handleChatItemClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };
  const handleChatItemDelete = async (chatId: string, index: number) => {
    setChatsData((prev) => prev.filter((_, i) => i !== index));
    router.push("/");

    const chatDocRef = doc(db, "chats", chatId);
    if (window.location.pathname === `/chat/${chatId}`) {
    }
    await deleteDocFromFireStore(chatDocRef);
  };

  return (
    <div>
      {loading && <Spinner />}
      {docsOccur &&
        chatsData?.map((c, index) => (
          <Item
            key={index}
            isSidebar={true}
            onClick={() => handleChatItemClick(c.docId)}
            onDelete={() => handleChatItemDelete(c.docId, index)}
            label={`${c.chatTitle}`}
          />
        ))}
    </div>
  );
};

export default ChatsList;
