"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { Chat } from "@prisma/client";
import { useChatContext } from "./ChatProvider";

export function ChatList({ chats }: { chats: Chat[] }) {
  const { chatId } = useChatContext();
  return (
    <>
      {chats.map((chat) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton asChild isActive={chat.id === chatId}>
            <Link href={`/${chat.id}`}>
              <span>{chat.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
