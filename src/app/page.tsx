"use client";

import ResponseField from "@/components/ResponseField";
import ChatInput from "@/components/ChatInput";
import { useState } from "react";

export default function Home() {
  const sendMessage = async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      });

      if (!res.body) return;

      setMessage("");

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
          if (line.trim() === "") continue;
          try {
            const chunk = JSON.parse(line);
            const content = chunk.choices?.[0]?.delta?.content || "";
            setResponse((prev) => prev + content);
          } catch (err) {
            console.error("Failed to parse line:", line);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [response, setResponse] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  return (
    <>
      <h1 className="fixed top-0 right-0 left-0 p-5 text-2xl font-bold h-18">
        10x Devs
      </h1>
      {!response && (
        <div className="flex justify-center items-center h-[calc(100vh-4.5rem)]">
          <p className="text-4xl">What do you want to build?</p>
        </div>
      )}
      <ResponseField
        content={response}
        className="box-border overflow-auto pt-24 pb-24 mx-auto mt-2 w-3/5 h-[calc(100vh-4.5rem)] font-sans leading-7 rounded-md border-none bg-inherit text-inherit"
      />
      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </>
  );
}
