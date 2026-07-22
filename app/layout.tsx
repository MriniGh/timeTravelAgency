import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeTravel Agency - Webapp Interactive",
  description:
    "Webapp immersive pour explorer Paris 1889, le Cretace et Florence 1504 avec chatbot, quiz et reservation.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
