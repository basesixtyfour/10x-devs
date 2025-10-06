"use client";

import ChatInput from "./ChatInput";
import H1 from "@/components/ui/H1";
import ChatWindow from "./ChatWindow";
import { useState } from "react";
import { ChatMessage } from "@/types";
import { createContext, useContext } from "react";

interface ChatContextType {
  chatId: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  systemPrompt: string;
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(
      "useChatContext must be used within a ChatContext.Provider"
    );
  }
  return context;
}

export default function Home() {
  const [chatId, setChatId] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("Be concise");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  return (
    <ChatContext.Provider
      value={{
        chatId,
        setChatId,
        systemPrompt,
        setSystemPrompt,
        message,
        setMessage,
        chatMessages,
        setChatMessages,
      }}
    >
      <div className="h-screen flex flex-col">
        <H1 className="w-fit p-4">10x Devs</H1>
        <ChatWindow className="grow md:w-3/5 md:mx-auto flex flex-col gap-4" />
        <ChatInput className="text-4xl" />
      </div>
    </ChatContext.Provider>
  );
}
