"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { ArrowUpIcon, MessageCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessage } from "@/lib/chat";
import { useChatContext } from "./ChatProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChatInput({ className }: { className?: string }) {
  const router = useRouter();
  const {
    message,
    setMessage,
    setChatMessages,
    systemPrompt,
    chatId,
    setChatId,
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    setIsLoading(true);
    sendChatMessage(
      message,
      setMessage,
      setChatMessages,
      systemPrompt,
      chatId,
      setChatId
    )
      .then((newId) => {
        if (!chatId && newId) {
          router.push(`/${newId}`);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <InputGroup
      className={cn(
        "md:w-3/5 mx-4 px-4 py-6 md:mx-auto my-4 w-[calc(100%-2rem)] rounded-4xl bg-chat-input border-none",
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
            handleSendMessage();
          }
        }}
      />
      <InputGroupAddon>
        <MessageCircle />
      </InputGroupAddon>
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <InputGroupButton
          variant="default"
          className="rounded-full"
          size="icon-sm"
          onClick={handleSendMessage}
        >
          <ArrowUpIcon />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      )}
    </InputGroup>
  );
}
