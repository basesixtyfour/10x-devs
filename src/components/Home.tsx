"use client";

import { useState } from "react";
import ChatInput from "@/components/ChatInput";
import ChatWindow from "@/components/ChatWindow";
import { sendChatMessage } from "@/lib/chat";
import { ChatMessage } from "@/types";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", role: "system", content: "Be concise" },
  ]);

  return (
    <>
      <h1 className="fixed top-0 right-0 left-0 p-5 text-2xl font-bold h-18">
        10x Devs
      </h1>

      {chatMessages.length === 1 && (
        <div className="flex justify-center items-center h-[calc(100vh-4.5rem)] px-5">
          <p className="text-4xl">What do you want to build?</p>
        </div>
      )}

      <ChatWindow chatMessages={chatMessages} />

      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={() =>
          sendChatMessage(message, chatMessages, setChatMessages)
        }
      />
    </>
  );
}
