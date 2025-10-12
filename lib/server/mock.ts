export async function mockStreamResponse() {
  return {
    toReadableStream: () => {
      return new ReadableStream({
        start(controller) {
          const gibberishWords = [
            "blorf", "zibble", "wump", "snorfle", "glim", "plonk", "drabble", "snoot", "frabble", "twizzle"
          ];
          for (let i = 0; i < gibberishWords.length; i++) {
            const word = gibberishWords[i];
            const chunk = {
              choices: [{ delta: { content: word + " " } }]
            };
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n`));
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        },
      });
    },
  };
}