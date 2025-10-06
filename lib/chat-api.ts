export async function createNewChat(systemPrompt: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ systemPrompt }),
  });
  if (!response.ok) {
    console.error("Failed to create chat", response);
    throw new Error("Failed to create chat");
  }
  return response.json();
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
  onChunk: (chunk: any) => void
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
      if (!line.startsWith("data:")) continue;
      const raw = line.slice(5).trim();
      if (!raw) continue;

      try {
        const json = JSON.parse(raw);
        onChunk(json);
      } catch {
      }
    }
  }
}
