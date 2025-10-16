import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarHeader,
  SidebarSeparator,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getChats } from "@/lib/server/chat";
import { ChatList } from "./ChatList";
import Link from "next/link";

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userId = session.user.id;
  const chats = await getChats(userId, { limit: 10, skip: 0 });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>10x-Devs</SidebarHeader>
        <SidebarMenuButton asChild>
          <Link href="/">
            <span>New Chat</span>
          </Link>
        </SidebarMenuButton>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ChatList chats={chats} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
