import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createChatMessage, storeStreamToDatabase, deleteChat, getChatMessages } from "@/lib/server/chat";
import { OpenAI } from "openai";
import { MessageSchema, ChatIdSchema } from "@/lib/server/validation";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest, props: { params: Promise<{ chatId: string }> }) {
  const params = await props.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chatIdParam = params.chatId;
  if (!chatIdParam) {
  return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
}

  const chatIdParsed = ChatIdSchema.safeParse({ chatId: chatIdParam });
  if (!chatIdParsed.success) {
    return NextResponse.json({ error: "Invalid chat ID format" }, { status: 400 });
  }

  const userId = session.user.id;
  const messageParsed = MessageSchema.safeParse(await request.json());
  if (!messageParsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const { message } = messageParsed.data;
  const { chatId } = chatIdParsed.data;

  let userMessageId: string | undefined;
  let userMessages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  let responseStream: {
    toReadableStream: () => ReadableStream<Uint8Array>;
  };
  let streams: ReadableStream[] = [];
  let assistantIdPromise: Promise<string | undefined>;
  let encoder: TextEncoder;
  let reader: ReadableStreamDefaultReader<Uint8Array>;
  let composedStream: ReadableStream;

  try {
    userMessageId = (await createChatMessage(userId, chatId, message, "user")).id;
  } catch (_) {
    return NextResponse.json({ error: "Failed to create user message" }, { status: 500 });
  }

  try {
    userMessages = await getChatMessages(userId, chatId);
  } catch (_) {
    return NextResponse.json({ error: "Failed to fetch chat messages" }, { status: 500 });
  }

  try {
    responseStream = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: userMessages,
      stream: true,
    });
  } catch (_) {
    return NextResponse.json({ error: "Failed to get OpenAI response" }, { status: 500 });
  }

  try {
    streams = responseStream.toReadableStream().tee();
    assistantIdPromise = storeStreamToDatabase(streams[1], userId, chatId);
    encoder = new TextEncoder();
    reader = streams[0].getReader();
    composedStream = new ReadableStream({
      async start(controller) {
        if (userMessageId) {
          const event = { event: "user_message_id", id: userMessageId };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          controller.enqueue(encoder.encode(`data:`));
          controller.enqueue(value);
          controller.enqueue(encoder.encode(`\n`));
        }
        try {
          const assistantId = await assistantIdPromise;
          if (assistantId) {
            const event = { event: "assistant_message_id", id: assistantId };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          }
        } catch {}
        controller.close();
      },
      cancel() {
        reader.cancel();
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to stream response" }, { status: 500 });
  }

  return new NextResponse(composedStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ chatId: string }> }) {
  const params = await props.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const chatIdParam = params.chatId;

  if (!chatIdParam) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
  }

  const chatIdParsed = ChatIdSchema.safeParse({ chatId: chatIdParam });
  if (!chatIdParsed.success) {
    return NextResponse.json({ error: "Invalid chat ID format" }, { status: 400 });
  }

  const { chatId } = chatIdParsed.data;
  
  try {
    const chat = await deleteChat(userId, chatId);
    return NextResponse.json(chat);
  } catch (error) {
    return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 });
  }
}