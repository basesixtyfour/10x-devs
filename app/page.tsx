import ChatInterface from "@/components/ChatInterface";
import { ChatProvider } from "@/components/ChatProvider";

export default async function HomePage() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}
