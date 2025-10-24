"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ChatMessage } from "@/types";
import { Chat } from "@prisma/client";

interface ChatContextType {
  currentChat: Chat | undefined;
  setCurrentChat: (chat: Chat) => void;
  systemPrompt: string;
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  initialChat?: Chat;
  initialMessages?: ChatMessage[];
  children: ReactNode;
}

export function ChatProvider({
  initialChat,
  initialMessages = [],
  children,
}: ChatProviderProps) {
  const [currentChat, setCurrentChat] = useState<Chat | undefined>(initialChat);
  const [systemPrompt, setSystemPrompt] = useState("Be concise");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialMessages);

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        setCurrentChat,
        systemPrompt,
        setSystemPrompt,
        message,
        setMessage,
        chatMessages,
        setChatMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
