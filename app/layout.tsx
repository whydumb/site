import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alicia",
  description: "Alicia AGI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
