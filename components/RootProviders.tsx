"use client";

import { ChatProvider } from "@/components/ChatProvider";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
