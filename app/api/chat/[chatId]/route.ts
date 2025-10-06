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

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
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

  try {
    const userMessageId = await createChatMessage(userId, chatId, message, "user");
    const userMessages = await getChatMessages(userId, chatId);

    const responseStream = await openai.chat.completions.create({
      model: "x-ai/grok-4-fast:free",
      messages: userMessages,
      stream: true,
    });

    const streams = responseStream.toReadableStream().tee();
    const assistantIdPromise = storeStreamToDatabase(streams[1], userId, chatId);

    const encoder = new TextEncoder();
    const reader = streams[0].getReader();
    const composedStream = new ReadableStream({
      async start(controller) {
        if (userMessageId) {
          const event = { event: "user_message_id", id: userMessageId };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          controller.enqueue(value);
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

    return new NextResponse(composedStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const chatIdParam = request.nextUrl.searchParams.get('chatId');

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