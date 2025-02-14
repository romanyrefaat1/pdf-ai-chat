import { db } from "@/firebase-config";
import {
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Create
export const createNewChatInFireStore = async (file: File, data: any) => {
  if (!file || !data) {
    throw new Error("Please provide both 'file' and 'data' arguments.");
  }

  try {
    // Upload file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);

    console.log("Uploading file to AWS...");
    const uploadResponse = await fetch("/api/uploadFileAWS", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const { url } = await uploadResponse.json();
    console.log("File uploaded successfully:", url);

    // Create chat document
    const chatId = uuidv4();
    const chatRef = doc(db, "chats", chatId);

    const chatData = {
      userId: data?.userId,
      fileName: file.name,
      fileUrl: url,
      createdAt: serverTimestamp(),
      docId: chatId,
      chatTitle: "Untitled",
    };

    console.log("Creating chat document...");
    await setDoc(chatRef, chatData);
    console.log("Chat document created");

    // Process the PDF
    console.log("Processing PDF...");
    const processResponse = await fetch("/api/processPdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdfUrl: url,
        chatId: chatId,
      }),
    });

    if (!processResponse.ok) {
      const errorData = await processResponse.json();
      console.error("PDF processing failed:", errorData);
      // Continue anyway as the chat document is created
    } else {
      console.log("PDF processed successfully");
    }

    return chatId;
  } catch (error) {
    console.error("Error in createNewChatInFireStore:", error);
    throw error;
  }
};

// Update
export const sendNewMessageToChat = async (
  message: any,
  chatId: string,
  isUser = true
): Promise<void> => {
  if (!message || !chatId) {
    throw new Error(
      "sendNewMessageToChat Error: Please provide message and chatId"
    );
  }

  try {
    const messageCollectionId = uuidv4();
    const messagesCollectionRef = doc(
      db,
      "chats",
      chatId,
      "messages",
      messageCollectionId
    );

    await setDoc(messagesCollectionRef, {
      role: isUser ? "user" : "assistant",
      label: message.label,
      createdAt: serverTimestamp(),
      lastUpdate: serverTimestamp(),
      messageId: messageCollectionId,
    });

    console.log("Message saved successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message");
    throw error;
  }
};

export const updateFireStoreDocument = async (
  documentRef,
  data
): { documentRef: DocumentReference; data: object } => {
  await setDoc(documentRef, data, { merge: true });
};

// Get
export const fetchDataFromFireStore = async (
  collectionReference: CollectionReference,
  ...queryConstraints: any[]
) => {
  try {
    if (!collectionReference) {
      throw new Error("Collection reference is required");
    }

    const q =
      queryConstraints.length > 0
        ? query(collectionReference, ...queryConstraints)
        : collectionReference;

    console.log("Fetching data from Firestore...");
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    console.log(`Fetched ${data.length} documents`);
    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    throw error;
  }
};

// Add proper error handling for JSON parsing

export const fetchAIResponse = async (message: string, chatHistory: Array) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, chatHistory }),
    });

    if (!response.ok) toast.error("Response not ok");
    return response.json();
  } catch (error) {
    toast.error("Caught error from frontend function:", error);
  }
};

// Delete
export const deleteDocFromFireStore = async (docRef: DocumentReference) => {
  await deleteDoc(docRef);
};
