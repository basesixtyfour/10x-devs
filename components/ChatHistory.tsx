"use client";

import { useChatContext } from "./ChatProvider";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatHistory() {
  const { chatMessages } = useChatContext();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div
      className="grow md:w-[48rem] md:mx-auto flex flex-col gap-4"
      ref={containerRef}
    >
      {chatMessages.map((m) => (
        <ChatBubble key={m.id} role={m.role} content={m.content} />
      ))}
    </div>
  );
}
