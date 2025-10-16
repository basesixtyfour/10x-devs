"use client";

import { useEffect } from "react";
import { ChatMessage } from "@/types";
import H1 from "@/components/ui/H1";
import ChatInput from "@/components/ChatInput";
import ChatHistory from "@/components/ChatHistory";
import { useChatContext } from "@/components/ChatProvider";

interface ChatInterfaceProps {
  initialChatId?: string;
  initialMessages?: ChatMessage[];
}

export default function ChatInterface({
  initialChatId = "",
  initialMessages = [],
}: ChatInterfaceProps) {
  const { chatId, setChatId, setChatMessages, message, setMessage } =
    useChatContext();

  useEffect(() => {
    if (initialChatId) {
      if (initialChatId !== chatId) {
        setChatId(initialChatId);
      }
      if (initialMessages && initialMessages.length) {
        setChatMessages(initialMessages);
      }
    } else {
      if (chatId) {
        setChatId("");
      }
      setChatMessages([]);
    }
    setMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialChatId, initialMessages]);

  return (
    <div className="h-dvh grow w-full dark:bg-background flex flex-col dark:text-white">
      <H1 className="w-fit p-4">10x Devs</H1>
      <ChatHistory />
      <ChatInput className="text-4xl" />
    </div>
  );
}
