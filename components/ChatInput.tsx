"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { ArrowUpIcon, MessageCircle, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSendChatMessage } from "@/lib/chat";
import { useChatContext } from "./ChatProvider";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

export default function ChatInput({ className }: { className?: string }) {
  const router = useRouter();
  const {
    message,
    setMessage,
    currentChat: { id: chatId } = {},
    isLoading,
    setIsLoading,
  } = useChatContext();
  const sendChatMessage = useSendChatMessage();
  const controller = useRef(new AbortController());
  const abortSignal = controller.current.signal;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    setIsLoading(true);
    sendChatMessage(abortSignal)
      .then((newId) => {
        if (!chatId && newId) {
          router.push(`/${newId}`);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancelMessage = () => {
    controller.current.abort({ name: "Chat Response cancelled" });
    controller.current = new AbortController();
    setIsLoading(false);
  };

  return (
    <InputGroup
      className={cn(
        "md:w-3/5 mx-4 px-4 py-2 md:mx-auto my-4 w-[calc(100%-2rem)] rounded-4xl border-none dark:bg-[#2b2b2b] h-auto min-h-9 shrink-0",
        className
      )}
    >
      <InputGroupInput
        id="chat-input-message"
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
        <Ban className="animate-spin" onClick={handleCancelMessage} />
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
