import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatMessage } from "@/types";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});


export async function POST(request: NextRequest) {
  const chatMessages = await request.json() as ChatMessage[]  ;

  if (!chatMessages || chatMessages.length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const messages: ChatCompletionMessageParam[] = chatMessages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const responseStream = await openai.chat.completions.create({
    model: "x-ai/grok-4-fast:free",
    messages,
    stream: true,
  });

  const stream = responseStream.toReadableStream();
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}