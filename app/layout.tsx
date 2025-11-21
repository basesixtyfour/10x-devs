import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { getChats } from "@/lib/server/chat";
import { TitleUpdater } from "@/components/TitleUpdater";
import { AppSidebar } from "@/components/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const userId = session?.user.id;
  const chats = userId ? await getChats(userId, { limit: 10, skip: 0 }) : [];

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`box-border ${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <ThemeProvider>
          <AppProvider initialChats={chats}>
            <TitleUpdater />
            <SidebarProvider defaultOpen={defaultOpen}>
              {session && <AppSidebar />}
              <main className="flex w-full">{children}</main>
            </SidebarProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
