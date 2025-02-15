import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ModalProvider from "@/components/providers/modal-context";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Chat - Your Smart Document Assistant",
  description: "Upload and chat with your PDFs using AI-powered conversations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Toaster />
          <ModalProvider>
            <ClerkProvider>{children}</ClerkProvider>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
