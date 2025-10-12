import { ChatMessage } from "@/types";
import H1 from "@/components/ui/H1";
import ChatInput from "@/components/ChatInput";
import HydrateChat from "@/components/HydrateChat";
import ChatHistory from "@/components/ChatHistory";

interface ChatInterfaceProps {
  initialChatId?: string;
  initialMessages?: ChatMessage[];
}

export default function ChatInterface({
  initialChatId = "",
  initialMessages = [],
}: ChatInterfaceProps) {
  return (
    <div className="h-screen flex flex-col">
      <H1 className="w-fit p-4">10x Devs</H1>
      <HydrateChat
        initialChatId={initialChatId}
        initialMessages={initialMessages}
      />
      <ChatHistory />
      <ChatInput className="text-4xl" />
    </div>
  );
}
