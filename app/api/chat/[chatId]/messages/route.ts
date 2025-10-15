import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getChatMessages } from "@/lib/server/chat";
import { ChatIdSchema } from "@/lib/server/validation";

export async function GET(request: NextRequest, props: { params: Promise<{ chatId: string }> }) {
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
    const chat = await getChatMessages(userId, chatId);
    return NextResponse.json(chat);
  } catch (_) {
    return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 });
  }
}