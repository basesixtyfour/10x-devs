"use client";

import { useEffect } from "react";
import { useChatContext } from "@/components/ChatProvider";
import { ChatMessage } from "@/types";

export default function HydrateChat({
  initialChatId = "",
  initialMessages = [],
}: {
  initialChatId?: string;
  initialMessages?: ChatMessage[];
}) {
  const { chatId, setChatId, setChatMessages } = useChatContext();

  useEffect(() => {
    if (initialChatId && initialChatId !== chatId) {
      setChatId(initialChatId);
    }
    if (initialMessages && initialMessages.length) {
      setChatMessages(initialMessages);
    }
    // run once per mount for given SSR props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialChatId, initialMessages]);

  return null;
}
