import { ChatMessage } from "@/types";

export async function sendChatMessage(
  message: string,
  chatMessages: ChatMessage[],
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  if (!message.trim()) return;

  const chatId = crypto.randomUUID();
  const newMessages: ChatMessage[] = [
    ...chatMessages,
    { id: chatId, role: "user", content: message },
  ];
  setChatMessages(newMessages);

  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify(newMessages),
  });

  if (!res.body) return;

  const responseId = crypto.randomUUID();
  setChatMessages((prev) => [
    ...prev,
    { id: responseId, role: "assistant", content: "" },
  ]);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const chunk = JSON.parse(line);
        const part = chunk.choices?.[0]?.delta?.content || "";
        if (part) {
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === responseId ? { ...m, content: m.content + part } : m
            )
          );
        }
      } catch {}
    }
  }
}
