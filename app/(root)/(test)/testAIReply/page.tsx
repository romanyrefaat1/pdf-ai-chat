"use client";
import { Button } from "@/components/ui/button";
import MarkdownDisplay from "@/components/ui/markdown-display";
import { fetchAIResponse } from "@/lib/firebase";
import { useEffect, useState } from "react";

const TestAIReply = () => {
  const [message, setMessage] = useState("What are all the colors of apples?");
  const [aIAnswer, setAIAnswer] = useState(
    "Ask me any question, I am here to help."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Add id to initial chat message
  const [chat, setChat] = useState([
    { id: "initial", role: "user", parts: "Hey there" },
  ]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const aiResponse = await fetchAIResponse(message, chat);

      if (aiResponse?.error) {
        console.error("AI Response Error:", aiResponse.error);
        setError(`AI Response Error: ${aiResponse.error}`);
        return;
      }
      console.log(aiResponse);
      setAIAnswer(aiResponse.modelAnswer);

      // Add unique IDs to new messages
      setChat((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: message,
        },
        {
          id: `model-${Date.now() + 1}`,
          role: "model",
          content: aiResponse.modelAnswer,
        },
      ]);
    } catch (error) {
      console.error("Catched error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSendMessage(e)}>
        <p>What are all the colors of apples?</p>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Send Message</Button>
      </form>
      {!loading && !error && <MarkdownDisplay content={aIAnswer} />}
      {loading && <>Loading</>}
      {error && error}
    </div>
  );
};

export default TestAIReply;
