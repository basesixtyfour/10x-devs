import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deleteChat } from "@/lib/server/chat";
import { ChatIdSchema } from "@/lib/server/validation";
import { jsonError } from "@/lib/server/http";
import { Prisma } from "@prisma/client";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ chatId: string }> },
) {
  const params = await props.params;
  const chatId = params.chatId;
  
  const url = new URL(request.url);
  url.pathname = `/api/chat/${chatId}/messages`;
  
  const body = await request.text();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("host");
  
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: requestHeaders,
    body: body,
    signal: request.signal,
  });
  
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ chatId: string }> },
) {
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
