import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ChatProvider } from "@/components/ChatProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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
        className={`box-border ${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <ThemeProvider>
          <ChatProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex w-full">
                {typeof window !== "undefined" &&
                  window.location.pathname !== "/login" &&
                  window.location.pathname !== "/register" && (
                    <SidebarTrigger className="p-4" />
                  )}
                {children}
              </main>
            </SidebarProvider>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
