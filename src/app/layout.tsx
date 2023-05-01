import "./globals.css";
import { Metadata } from "next";

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
    <html lang="pt" className="dark">
      <body className="dark:bg-gray-900">{children}</body>
    </html>
  );
}
