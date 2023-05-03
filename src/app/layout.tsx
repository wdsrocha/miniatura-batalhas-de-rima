import "./globals.css";
import { fonts } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Miniatura de Vídeo para Batalhas de Rima",
  description:
    "Gere uma miniatura de vídeo para sua Batalha de Rima no YouTube",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-gray-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
