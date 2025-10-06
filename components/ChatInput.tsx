"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { ArrowUpIcon, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessage } from "@/lib/chat";
import { useChatContext } from "./Home";

export default function ChatInput({ className }: { className?: string }) {
  const {
    message,
    setMessage,
    setChatMessages,
    systemPrompt,
    chatId,
    setChatId,
  } = useChatContext();
  return (
    <InputGroup
      className={cn(
        "md:w-3/5 mx-4 px-4 py-6 md:mx-auto my-4 w-[calc(100%-2rem)] rounded-4xl dark:bg-[#303030] border-none",
        className
      )}
    >
      <InputGroupInput
        className="text-xl md:text-xl"
        placeholder="Ask me anything"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage(
              message,
              setMessage,
              setChatMessages,
              systemPrompt,
              chatId,
              setChatId
            );
          }
        }}
      />
      <InputGroupAddon>
        <MessageCircle />
      </InputGroupAddon>
      <InputGroupButton
        variant="default"
        className="rounded-full"
        size="icon-sm"
        onClick={() => {
          sendChatMessage(
            message,
            setMessage,
            setChatMessages,
            systemPrompt,
            chatId,
            setChatId
          );
        }}
      >
        <ArrowUpIcon />
        <span className="sr-only">Send</span>
      </InputGroupButton>
    </InputGroup>
  );
}
