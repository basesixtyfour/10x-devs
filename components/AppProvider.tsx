"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { Chat } from "@prisma/client";

interface AppContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}

interface AppProviderProps {
  initialChats: Chat[];
  children: ReactNode;
}

export function AppProvider({ initialChats, children }: AppProviderProps) {
  const pathname = usePathname();
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(
    pathname === "/"
      ? null
      : initialChats.find((chat) => chat.id === pathname.split("/")[1]) || null
  );

  return (
    <AppContext.Provider
      value={{
        chats,
        setChats,
        activeChat,
        setActiveChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
