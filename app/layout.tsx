import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import RootProviders from "@/components/RootProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "10x Devs",
  description: "10x Devs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`dark:bg-[#212121] dark:text-white box-border ${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <ThemeProvider>
          <RootProviders>{children}</RootProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
