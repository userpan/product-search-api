"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { ApiKeyProvider } from "../contexts/ApiKeyContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApiKeyProvider>
          <Header />
          {children}
        </ApiKeyProvider>
      </body>
    </html>
  );
}