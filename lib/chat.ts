import { ChatMessage } from "@/types";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { createNewChat, sendMessageToChat, streamChatResponse } from "@/lib/chat-api";

export async function sendChatMessage(
  message: string,
  setMessage: (message: string) => void,
  setChatMessages: (updater: React.SetStateAction<ChatMessage[]>) => void,
  systemPrompt: string,
  chatId: string,
  setChatId: (chatId: string) => void,
) {
  const trimmed = message.trim();
  if (!trimmed) return;

  const { data: session } = await authClient.getSession();
  if (!session) redirect("/login");

  const currentChatId = chatId || (await createNewChat(systemPrompt)).id;
  setChatId(currentChatId);

  setMessage("");

  const userTempId = crypto.randomUUID();
  const assistantTempId = crypto.randomUUID();

  setChatMessages((prev) => [
    ...prev,
    { id: userTempId, role: "user", content: trimmed },
    { id: assistantTempId, role: "assistant", content: "" },
  ]);

  try {
    const body = await sendMessageToChat(currentChatId, trimmed);

    await streamChatResponse(body, (chunk) => {
      if (chunk.event === "user_message_id" && typeof chunk.id === "string") {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === userTempId ? { ...m, id: chunk.id as string } : m
          )
        );
        return;
      }

      if (chunk.event === "assistant_message_id" && typeof chunk.id === "string") {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === assistantTempId ? { ...m, id: chunk.id as string } : m
          )
        );
        return;
      }

      const part = chunk.choices?.[0]?.delta?.content || chunk.content || "";
      if (part) {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === assistantTempId ? { ...m, content: m.content + part } : m
          )
        );
      }
    });
  } catch (err) {
    console.error("Chat streaming error:", err);
  }
}