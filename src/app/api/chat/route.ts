import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
  const message = (await request.json()).message;

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const response = await openai.chat.completions.create({
    model: "x-ai/grok-4-fast:free",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": message
          }
        ]
      }
    ],

  });

  console.log(response.choices[0].message);
  return NextResponse.json(response);
}