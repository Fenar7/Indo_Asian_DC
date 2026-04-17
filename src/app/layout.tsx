import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Indo Asian DC",
  description: "Frontend foundation for the Indo Asian DC web app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
