import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pideh Armenia - Мини-пиццы в виде аджарских хачапури",
  description: "Лодочки с начинкой как у пиццы. 15 уникальных вкусов для настоящих гурманов! Доставка по Еревану.",
  keywords: "хачапури, аджарские хачапури, мини-пиццы, доставка еды, Ереван, Армения",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
