"use client";

import { useChatContext } from "./ChatProvider";
import ChatBubble from "./ChatBubble";

export default function ChatHistory() {
  const { chatMessages } = useChatContext();
  return (
    <div className="grow md:w-3/5 md:mx-auto flex flex-col gap-4">
      {chatMessages.map((m) => (
        <ChatBubble key={m.id} role={m.role} content={m.content} />
      ))}
    </div>
  );
}
