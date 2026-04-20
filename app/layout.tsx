import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "DukkanApp",
  description:
    "Iki subeli baharat dukkanlari icin siparis, teslim alma ve admin yonetim altyapisi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
