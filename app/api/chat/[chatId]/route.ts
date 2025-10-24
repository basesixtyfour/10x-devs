import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createChatMessage, storeStreamToDatabase, deleteChat, getChatMessages } from "@/lib/server/chat";
import { openai } from "@/lib/server/openai";
import { MessageSchema, ChatIdSchema } from "@/lib/server/validation";
import { jsonError, sseHeaders } from "@/lib/server/http";
import { createSSEStream } from "@/lib/server/sse";
import ratelimit from "@/lib/ratelimit";
import { Prisma, Role } from "@prisma/client";

export async function POST(request: NextRequest, props: { params: Promise<{ chatId: string }> }) {
  const checkAborted = () => {
    if (request.signal.aborted) {
      throw new Error("Request aborted");
    }
  };

  checkAborted();
  
  const params = await props.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  checkAborted();

  const { success } = await ratelimit.limit(session.user.id);
  if (!success) {
    return jsonError("Rate limit exceeded", 429);
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
    checkAborted();

    const userMessageId = (await createChatMessage(userId, chatId, message, Role.user)).id;
    const userMessages = await getChatMessages(userId, chatId);
    
    checkAborted();

    const completionStream = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite",
      messages: userMessages,
      stream: true,
    });

    const abortStreamHandler = () => {
      console.log("Stream cancelled");
      completionStream.controller.abort();
    };

    request.signal.addEventListener("abort", abortStreamHandler);

    const [forwardStream, persistStream] = completionStream.toReadableStream().tee();
    const assistantIdPromise = storeStreamToDatabase(persistStream, userId, chatId, () => request.signal.aborted);
    const sseStream = createSSEStream(forwardStream, assistantIdPromise, userMessageId, () => request.signal.aborted);

    return new NextResponse(sseStream, { headers: sseHeaders() });
  } catch (err) {
    if (err instanceof Error && err.message === "Request aborted") {
      console.log("Caught abort during processing");
      return jsonError("Request cancelled", 499);
    }
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
    return jsonError("Unauthorized", 401);
  }

  const userId = session.user.id;
  const chatIdParam = params.chatId;

  if (!chatIdParam) {
    return jsonError("Chat ID is required", 400);
  }

  const chatIdParsed = ChatIdSchema.safeParse({ chatId: chatIdParam });
  if (!chatIdParsed.success) {
    return jsonError("Invalid chat ID format", 400);
  }

  const { chatId } = chatIdParsed.data;
  
  try {
    const chat = await deleteChat(userId, chatId);
    return NextResponse.json(chat);
  } catch (error) {
    console.error("/api/chat/[chatId] DELETE failed", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return jsonError("Chat not found", 404);
      } 
    }
    return jsonError("Internal server error", 500);
  }
}