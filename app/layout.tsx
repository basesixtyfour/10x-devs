import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ConditionalSidebarTrigger } from "@/components/ConditionalSidebarTrigger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getChats } from "@/lib/server/chat";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userId = session.user.id;
  const chats = await getChats(userId, { limit: 10, skip: 0 });

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`box-border ${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <ThemeProvider>
          <AppProvider initialChats={chats}>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex w-full">
                <ConditionalSidebarTrigger />
                {children}
              </main>
            </SidebarProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
