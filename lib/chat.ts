import {
  createNewChat,
  sendMessageToChat,
  streamChatResponse,
} from "@/lib/chat-api";
import { useChatContext } from "@/components/ChatProvider";
import { useAppContext } from "@/components/AppProvider";
import { Chat, Role } from "@prisma/client";

export function useSendChatMessage() {
  const {
    message,
    setMessage,
    setChatMessages,
    systemPrompt,
    currentChat,
    setCurrentChat,
  } = useChatContext();
  const { chats, setChats, setActiveChat } = useAppContext();

  const send = async (abortSignal: AbortSignal): Promise<string> => {
    const content = message.trim();
    if (!content) return "Message must be non-zero";

    setMessage("");

    const userTempId = crypto.randomUUID();
    setChatMessages((prev) => [
      ...prev,
      { id: userTempId, role: Role.user, content: content },
    ]);

    let chat = currentChat;
    if (!chat) {
      chat = (await createNewChat(systemPrompt, content)) as Chat;
      setCurrentChat(chat);
      setActiveChat(chat);
      setChats([chat, ...chats]);
    }

    const currentChatId = chat.id;
    const assistantTempId = crypto.randomUUID();

    setChatMessages((prev) => [
      ...prev,
      { id: assistantTempId, role: Role.assistant, content: "" },
    ]);

    try {
      const body = await sendMessageToChat(currentChatId, content, abortSignal);

      await streamChatResponse(body, (chunk) => {
        if (chunk.event === "user_message_id" && typeof chunk.id === "string") {
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === userTempId ? { ...m, id: chunk.id as string } : m,
            ),
          );
          return;
        }

        if (
          chunk.event === "assistant_message_id" &&
          typeof chunk.id === "string"
        ) {
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === assistantTempId ? { ...m, id: chunk.id as string } : m,
            ),
          );
          return;
        }
        const part = chunk.choices?.[0]?.delta?.content || "";
        if (part) {
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === assistantTempId
                ? { ...m, content: m.content + part }
                : m,
            ),
          );
        }
      });
    } catch (err: any) {
      if (err.name === "Chat Response cancelled") {
      } else console.error("Chat streaming error:", err);
    }
    return currentChatId;
  };

  return send;
}
