import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createChatMessage, storeStreamToDatabase, deleteChat } from "@/lib/server/chat";
import { OpenAI } from "openai";
import { MessageSchema, ChatIdSchema } from "@/lib/server/validation";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});


export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chatIdParam = request.nextUrl.searchParams.get('chatId');
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
    const chat = await createChatMessage(userId, chatId, message, "user");

    const responseStream = await openai.chat.completions.create({
      model: "x-ai/grok-4-fast:free",
      messages: chat.messages,
      stream: true,
    });

    const streams = responseStream.toReadableStream().tee();
    
    storeStreamToDatabase(streams[1], userId, chatId);
    
    return new NextResponse(streams[0], {
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