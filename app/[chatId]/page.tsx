import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getChatMessages } from "@/lib/server/chat";
import ChatInterface from "@/components/ChatInterface";

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
    const messages = await getChatMessages(session.user.id, chatId);
    console.log(messages);
    return <ChatInterface initialChatId={chatId} initialMessages={messages} />;
  } catch (error) {
    redirect("/");
  }
}
