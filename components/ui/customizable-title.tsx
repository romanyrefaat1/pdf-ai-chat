"use client";
import { toast } from "sonner";
import { Button } from "./button";
import { useEffect, useState } from "react";

import {
  fetchDataFromFireStore,
  updateFireStoreDocument,
} from "@/lib/firebase";
import { collection, doc, where } from "firebase/firestore";
import { db } from "@/firebase-config";

const CustomizableTitle = ({ chatId }: { chatId: string }) => {
  const [changableTitle, setChangableTitle] = useState("Untitled");
  const [title, setTitle] = useState("Untitled");
  const [isAcceptedTitle, setIsAcceptedTitle] = useState(false);
  const [isTitleChanged, setIsTitleChanged] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataFromFireStore(
        collection(db, "chats"),
        where("docId", "==", chatId)
      );
      if (data && data.length > 0) {
        setTitle(data[0].title || "Untitled");
        setChangableTitle(data[0].title || "Untitled");
      }
      console.log("Fetched data:", data);
    };

    fetchData();
  }, [chatId]);

  const handleChange = (e: React.FormEvent<HTMLParagraphElement>) => {
    setChangableTitle(e.target.value || "");
    setIsTitleChanged(true);
    setIsAcceptedTitle(false);
  };

  const handleAccept = async () => {
    setIsTitleChanged(false);
    setIsAcceptedTitle(true);
    setIsEditMode(false);
    // Handling title to not be empty
    if (changableTitle.length === 0) {
      // setTitle("Untitled");
      toast.warning("You can't set the title of a chat empty.");
    } else {
      setTitle(changableTitle);
    }

    const documentRef = doc(db, "chats", chatId);
    const data = {
      title: changableTitle,
    };
    await updateFireStoreDocument(documentRef, data);
  };

  const handleUndo = () => {
    setChangableTitle(title);
    setIsEditMode(false);
    setIsAcceptedTitle(false);
    setIsTitleChanged(false);
  };

  return (
    <div className="relative bg-primary/500 w-fit">
      <div className="bg-primary/500 p-2">
        {!isEditMode ? (
          <p
            className="outline-none outline-hidden focus:outline-none border-none focus:border-none shadow-none"
            role="button"
            style={{ outline: "none" }}
            onClick={() => setIsEditMode(true)}
          >
            {isTitleChanged ? changableTitle : title}
          </p>
        ) : (
          <input
            type="text"
            value={changableTitle}
            onChange={(e) => handleChange(e)}
            className="bg-background/500 focus:bg-background text-foreground focus:rounded-[100px] transition"
            style={{ fieldSizing: `content` }}
          />
        )}

        {isTitleChanged && (
          <div className="absolute top-[20px] right-[100px] flex gap-2 p-2">
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={handleAccept}
              className="bg-green-600 hover:bg-green-500 p-2 rounded-lg "
            >
              Save
            </Button>
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={handleUndo}
              className="bg-red-600 hover:bg-red-500 p-2 rounded-lg "
            >
              Undo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizableTitle;
