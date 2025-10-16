import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getChats, createNewChat } from "@/lib/server/chat";
import { NewChatSchema, PaginationSchema } from "@/lib/server/validation";


export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = PaginationSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid pagination parameters" }, { status: 400 });
  }

  const { limit, skip } = parsed.data;
  const userId = session.user.id;
  
  const chat = await getChats(userId, { limit, skip });
  return NextResponse.json(chat);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const parsed = NewChatSchema.safeParse(await request.json());
  if (!parsed.success) {
    console.error(parsed);
    return NextResponse.json({ error: "Invalid new chat data" }, { status: 400 });
  }

  const { systemPrompt, message } = parsed.data;
  const chat = await createNewChat(userId, systemPrompt, message);
  
  return NextResponse.json(chat);
}