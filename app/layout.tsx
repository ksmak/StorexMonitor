import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/navbar";

export const metadata: Metadata = {
  title: "Storex Monitor",
  description: "Storex Мониторинг серверов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
