import { ReactNode } from "react";

// Layout Types
export interface LayoutProps {
  children: ReactNode;
}

export interface ChatLayoutProps extends LayoutProps {
  defaultCollapse?: boolean;
}

export interface PDFChatLayoutProps {
  pdfPreview: ReactNode;
  chatSection: ReactNode;
}

// Component Types
export interface NavbarProps {
  className?: string;
}

export interface DropzoneFormProps {
  size?: "xs" | "sm" | "normal" | "lg" | "xl";
  accept?: Record<string, string[]>;
}

export interface ChatSectionProps {
  chatId: string;
}

export interface PDFPreviewerProps {
  chatId: string;
}

export interface ButtonProps {
  variant?: "default" | "link" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Add Firebase Types
export interface ChatDocument {
  id: string;
  // Add other fields as needed
}

// API Types
export interface UploadResponse {
  url: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

export interface FileUploadData {
  file: string;
  fileName: string;
  fileType: string;
}

// Component Props Types
export interface MarkdownDisplayProps {
  content: string;
  isAnimation?: boolean;
  placeholderText?: string;
}

export interface ChatInputFormProps {
  onSubmit: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
  size?: "xs" | "sm" | "normal" | "lg" | "xl";
}

// Firebase Types
export type FirebaseDoc = {
  id: string;
  [key: string]: any; // This is temporary, replace with specific types
};
