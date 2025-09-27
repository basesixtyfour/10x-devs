"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResponseField from "@/components/ResponseField";
import { useState } from "react";

export default function Home() {
  const handleClick = async () => {
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
            setResponse(prev => prev + content);
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
    <div className="dark:bg-[#2d2d30] flex flex-col w-screen px-64 items-center justify-center h-screen gap-4">
      <div className="flex flex-col gap-4 justify-center items-center w-full">
        <h1 className="text-2xl font-bold">10x Devs</h1>
        <p className="text-sm text-gray-500">
          What would you like to build today?
        </p>
      </div>
      {response && <ResponseField content={response} />}
      <div className="flex flex-row gap-4 justify-center items-center self-end w-full shrink-0">
        <Input className="rounded-md border-2 border-gray-300" placeholder="Enter your prompt" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={handleClick}>Send</Button>
      </div>
    </div>
  );
}