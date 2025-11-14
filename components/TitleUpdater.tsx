"use client";

import { useEffect } from "react";
import { useAppContext } from "./AppProvider";

export function TitleUpdater() {
  const { activeChat } = useAppContext();

  useEffect(() => {
    document.title = activeChat ? activeChat.title ?? "New Chat" : "10x Devs";
  }, [activeChat]);

  return null;
}
