"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { useAppContext } from "./AppProvider";

export function ChatList() {
  const { activeChat, chats, setActiveChat } = useAppContext();

  return (
    <>
      {chats.map((chat) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton asChild isActive={chat.id === activeChat?.id}>
            <Link href={`/${chat.id}`} onClick={() => setActiveChat(chat)}>
              <span>{chat.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
