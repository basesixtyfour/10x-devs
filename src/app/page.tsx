"use client";

import ResponseField from "@/components/ResponseField";
import ChatInput from "@/components/ChatInput";
import { useState } from "react";
import MessageField from "@/components/MessageField";
import { ChatMessage } from "@/types";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", role: "system", content: "Be concise" },
  ]);

  const sendMessage = async () => {
    try {
      if (!message.trim()) return;

      setMessage("");

      const chatId = crypto.randomUUID();
      const newMessages: ChatMessage[] = [
        ...chatMessages,
        { id: chatId, role: "user", content: message },
      ];

      setChatMessages(newMessages);

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(newMessages),
      });

      if (!res.body) return;

      const responseId = crypto.randomUUID();
      setChatMessages((prev) => [
        ...prev,
        { id: responseId, role: "assistant", content: "" },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const chunk = JSON.parse(line);
            const part = chunk.choices?.[0]?.delta?.content || "";
            if (part) {
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === responseId ? { ...m, content: m.content + part } : m
                )
              );
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <h1 className="fixed top-0 right-0 left-0 p-5 text-2xl font-bold h-18">
        10x Devs
      </h1>
      {chatMessages.length === 1 && (
        <div className="flex justify-center items-center h-[calc(100vh-4.5rem)]">
          <p className="text-4xl">What do you want to build?</p>
        </div>
      )}
      <div className="flex flex-col gap-4 overflow-auto pt-24 pb-24 mx-auto mt-2 w-3/5 h-[calc(100vh-4.5rem)] font-sans leading-7 rounded-md bg-[#202020e6] text-inherit">
        {chatMessages.map((chatMessage) => {
          if (chatMessage.role === "user") {
            return (
              <MessageField
                key={chatMessage.id}
                message={chatMessage.content}
              />
            );
          } else if (chatMessage.role === "assistant") {
            return (
              <ResponseField
                key={chatMessage.id}
                content={chatMessage.content}
                className="border-none shadow-none bg-inherit text-inherit"
              />
            );
          } else return null;
        })}
      </div>
      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </>
  );
}
