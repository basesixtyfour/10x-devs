import { prisma } from "../prisma";
import { Role } from "@prisma/client";
import { Pagination } from "./validation";

export async function getChats(userId: string, { limit, skip }: Pagination) {
  const chats = await prisma.chat.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: skip,
  });
  return chats;
}

export async function createNewChat(userId: string, systemPrompt: string) {
  const chat = await prisma.chat.create({
    data: {
      userId: userId,
      messages: {
        create: {
          content: systemPrompt,
          role: "system",
        },
      },
    },
  });
  return chat;
}

export async function deleteChat(userId: string, chatId: string) {
  const result = await prisma.chat.deleteMany({
    where: {
      id: chatId,
      userId: userId
    }
  });
  
  if (result.count === 0) {
    throw new Error("Not found or unauthorized");
  }
  
  return { id: chatId };
}

export async function getChatMessages(userId: string, chatId: string) {
  const chat = await prisma.chat.findFirst({
    where: { 
      id: chatId, 
      userId: userId 
    }
  });

  if (!chat) 
    throw new Error("Not found or unauthorized");

  const messages = await prisma.message.findMany({
    where: { chatId: chatId },
    orderBy: { createdAt: "asc" }
  })
  
  return messages;
}


export async function createChatMessage(userId: string, chatId: string, message: string, role: Role) {
  const chat = await prisma.chat.findFirst({
    where: { 
      id: chatId, 
      userId: userId 
    }
  });

  if (!chat) {
    throw new Error("Not found or unauthorized");
  }

  const newMessage = await prisma.message.create({
    data: { content: message, role: role, chatId: chatId },
  });

  return newMessage;
}

export async function storeStreamToDatabase(stream: ReadableStream, userId: string, chatId: string) {
  try {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";
    let chunk = "";
    const MAX_CONTENT_SIZE = 100000;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunk += decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      chunk = lines.pop() || "";
      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.trim() === '[DONE]') break;
        
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') break;
            
            const data = JSON.parse(jsonStr);
            const content = data.choices?.[0]?.delta?.content || "";
            
            if (fullContent.length + content.length > MAX_CONTENT_SIZE) {
              console.warn(`Content size limit reached for chat ${chatId}`);
              break;
            }
            
            fullContent += content;
          } catch (e) {
            if (Math.random() < 0.01) {
              console.warn('Stream parse error:', e instanceof Error ? e.message : String(e));
            }
          }
        }
      }
    }

    const newMessage = await createChatMessage(userId, chatId, fullContent, "assistant");
    console.log(`✅ Stored assistant message for chat ${chatId}`);
    return newMessage.id;
  } catch (error) {
    console.error("Error storing stream to database:", error);
    return undefined;
  }
}