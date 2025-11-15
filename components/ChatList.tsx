"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useAppContext } from "./AppProvider";
import { deleteChat, renameChat } from "@/lib/chat-api";

export function ChatList() {
  const { activeChat, chats, setActiveChat, setChats } = useAppContext();
  return (
    <>
      {chats.map((chat) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton
            asChild
            isActive={chat.id === activeChat?.id}
            className="justify-between"
          >
            <div className="flex w-full items-center justify-between">
              <Link
                href={`/${chat.id}`}
                onClick={() => setActiveChat(chat)}
                className="overflow-hidden h-full text-xs grow"
              >
                <span>{chat.title}</span>
              </Link>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" aria-label="Open menu" size="icon-sm">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={() => {
                        const newTitle = window.prompt(
                          "Enter new chat name",
                          chat.title ?? ""
                        );
                        if (
                          newTitle &&
                          newTitle.trim() &&
                          newTitle !== chat.title
                        ) {
                          renameChat(chat.id, newTitle).then((updatedChat) => {
                            setChats(
                              chats.map((c) =>
                                c.id === chat.id
                                  ? { ...c, title: updatedChat.title }
                                  : c
                              )
                            );
                            if (chat.id === activeChat?.id) {
                              setActiveChat({
                                ...activeChat,
                                title: updatedChat.title,
                              });
                            }
                          });
                        }
                      }}
                    >
                      <Pencil /> Rename Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        deleteChat(chat.id).then(() => {
                          setChats(chats.filter((c) => c.id !== chat.id));
                          if (chat.id === activeChat?.id) {
                            setActiveChat(null);
                            redirect("/");
                          }
                        })
                      }
                    >
                      <Trash /> Delete Chat
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
