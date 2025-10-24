import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getChat } from "@/lib/server/chat";
import ChatInterface from "@/components/ChatInterface";
import { ChatProvider } from "@/components/ChatProvider";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { chatId } = await params;

  try {
    const chat = await getChat(session.user.id, chatId);
    return (
      <ChatProvider initialChat={chat} initialMessages={chat.messages}>
        <ChatInterface />
      </ChatProvider>
    );
  } catch (error) {
    redirect("/");
  }
}
