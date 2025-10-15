import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createChatMessage, storeStreamToDatabase, deleteChat, getChatMessages } from "@/lib/server/chat";
import { openai } from "@/lib/server/openai";
import { MessageSchema, ChatIdSchema } from "@/lib/server/validation";
import { jsonError, sseHeaders } from "@/lib/server/http";
import { createSSEStream } from "@/lib/server/sse";
import ratelimit from "@/lib/ratelimit";

export async function POST(request: NextRequest, props: { params: Promise<{ chatId: string }> }) {
  const params = await props.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const clientIp = (request.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim()
  const { success } = await ratelimit.limit(clientIp);
  if (!success) {
    return jsonError("Rate limit exceeded", 429);
  }

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  const chatIdParam = params.chatId;
  if (!chatIdParam) {
    return jsonError("Chat ID is required", 400);
  }

  const chatIdParsed = ChatIdSchema.safeParse({ chatId: chatIdParam });
  if (!chatIdParsed.success) {
    return jsonError("Invalid chat ID format", 400);
  }

  const body = await request.json().catch(() => undefined);
  const messageParsed = MessageSchema.safeParse(body);
  if (!messageParsed.success) {
    return jsonError("Invalid message", 400);
  }

  const userId = session.user.id;
  const { message } = messageParsed.data;
  const { chatId } = chatIdParsed.data;

  try {
    const userMessageId = (await createChatMessage(userId, chatId, message, "user")).id;
    const userMessages = await getChatMessages(userId, chatId);

    const completionStream = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite",
      messages: userMessages,
      stream: true,
    });

    const [forwardStream, persistStream] = completionStream.toReadableStream().tee();
    const assistantIdPromise = storeStreamToDatabase(persistStream, userId, chatId);
    const sseStream = createSSEStream(forwardStream, assistantIdPromise, userMessageId);

    return new NextResponse(sseStream, { headers: sseHeaders() });
  } catch (err) {
    console.error("/api/chat/[chatId] POST failed", err);
    return jsonError("Internal server error", 500);
  }
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