"use client";
import Link from "next/link";
import { useAppContext } from "./AppProvider";

export function NewChatButton() {
  const { setActiveChat } = useAppContext();
  return (
    <Link
      href="/"
      onClick={() => setActiveChat(null)}
      className="w-full px-4 py-2"
    >
      <span>New Chat</span>
    </Link>
  );
}
