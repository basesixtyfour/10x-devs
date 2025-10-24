export function createSSEStream(
  source: ReadableStream<Uint8Array>,
  assistantIdPromise: Promise<string | undefined>,
  userMessageId: string,
  isAborted: () => boolean
) {
  const encoder = new TextEncoder();
  const reader = source.getReader();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      if (userMessageId) {
        const event = { event: "user_message_id", id: userMessageId };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }
      while (!isAborted()) {
        const { value, done } = await reader.read();
        if (done) break;
        controller.enqueue(encoder.encode("data: "));
        controller.enqueue(value);
        controller.enqueue(encoder.encode("\n"));
      }
      try {
        const assistantId = await assistantIdPromise;
        if (assistantId) {
          const event = { event: "assistant_message_id", id: assistantId };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}


