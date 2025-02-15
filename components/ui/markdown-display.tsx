"use client";
import React, { useState, useEffect, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownDisplay = ({
  content,
  isAnimation = false,
}: {
  content: string;
  isAnimation: boolean;
}) => {
  const placeholderText = content;

  const [displayText, setDisplayText] = useState(isAnimation ? `` : content);

  useEffect(() => {
    if (isAnimation) {
      let isMounted = true;
      const animateText = async () => {
        setDisplayText("");
        for (let i = 0; i < placeholderText.length; i++) {
          if (!isMounted) break;
          setDisplayText((text) => text + placeholderText[i]);
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      };

      animateText();

      return () => {
        isMounted = false;
      };
    }
  }, []);

  useEffect(() => {
    if (!content || !isAnimation) return;
    animateText();
  }, [content, isAnimation, placeholderText, animateText]);

  const components = {
    a: ({ node, ...props }) => (
      <a {...props} className="text-blue-600 hover:text-blue-800 underline" />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote
        {...props}
        className="border-l-4 border-gray-300 pl-4 my-4 italic"
      />
    ),
    ul: ({ node, ...props }) => (
      <ul {...props} className="list-disc list-inside my-4 space-y-2" />
    ),
    strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
    em: ({ node, ...props }) => <em {...props} className="italic" />,
  };

  return (
    <div className="p-6 mx-auto font-sans shadow-md rounded-lg">
      <div className="flex gap-x-2"></div>
      <div className="border max-w-2xl mx-auto p-4 rounded-lg prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {displayText}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownDisplay;
