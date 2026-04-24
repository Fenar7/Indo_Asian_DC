import type { Metadata } from "next";
import "./globals.scss";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Indo Asian Foods Ltd | Premium Groceries & Spices",
  description: "Discover premium groceries, authentic spices, and daily essentials at Indo Asian Foods. Explore our fresh selections, festival offers, and high-quality products.",
  icons: {
    icon: "/icons/indo-asian-logo-main.png?v=2", // Forces explicit favicon path and busts cache
    apple: "/icons/indo-asian-logo-main.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
