export async function createNewChat(systemPrompt: string, message: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ systemPrompt, message}),
  });
  if (!response.ok) {
    throw new Error("Failed to create chat");
  }
  const data = await response.json();
  console.log("createNewChat data", data);
  return data;
}

export async function sendMessageToChat(chatId: string, message: string) {
  const res = await fetch(`/api/chat/${chatId}`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  if (!res.ok || !res.body) throw new Error("Failed to send message");
  return res.body;
}

export async function streamChatResponse(
  body: ReadableStream<Uint8Array>,
  onChunk: (chunk: {
    event?: string;
    id?: string;
    choices?: { delta?: { content?: string } }[];
    content?: string;
  }) => void
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (!raw) continue;

      try {
        const json = JSON.parse(raw);
        onChunk(json);
      } catch {
      }
    }
  }
}
