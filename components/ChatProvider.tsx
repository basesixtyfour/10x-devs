"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { ChatMessage } from "@/types";

interface ChatContextType {
  chatId: string;
  setChatId: (chatId: string) => void;
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
  initialChatId?: string;
  initialMessages?: ChatMessage[];
  children: ReactNode;
}

export function ChatProvider({
  initialChatId = "",
  initialMessages = [],
  children,
}: ChatProviderProps) {
  const router = useRouter();
  const [chatId, setChatIdState] = useState(initialChatId);
  const [systemPrompt, setSystemPrompt] = useState("Be concise");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialMessages);

  // Navigate to chat route when chatId changes (new chat created)
  const setChatId = (newChatId: string) => {
    setChatIdState(newChatId);
    if (newChatId && newChatId !== initialChatId) {
      router.push(`/${newChatId}`);
    }
  };

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
      {children}
    </ChatContext.Provider>
  );
}
