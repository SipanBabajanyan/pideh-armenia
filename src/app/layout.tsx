import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import MobileBottomNav from "@/components/MobileBottomNav";
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pideh Armenia - Армянские пиде новый вкус",
  description: "Традиционная форма с современными начинками. 15 уникальных вкуса для настоящих гурманов! Доставка по Еревану.",
  keywords: "пиде, армянские пиде, мини-пиццы, доставка еды, Ереван, Армения",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ServiceWorkerProvider />
        <ClientProviders>
          {children}
          <MobileBottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
